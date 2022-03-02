import { GroupSaveBadgeComposer } from '@nitrots/nitro-renderer';
import { Dispatch, FC, SetStateAction, useCallback, useEffect, useState } from 'react';
import { Column, Flex, Grid } from '../../../../common';
import { SendMessageHook } from '../../../../hooks';
import { BadgeImageView } from '../../../../views/shared/badge-image/BadgeImageView';
import { GroupBadgePart } from '../../common/GroupBadgePart';
import { IGroupData } from '../../common/IGroupData';
import { useGroupsContext } from '../../GroupsContext';
import { GroupBadgeCreatorView } from '../GroupBadgeCreatorView';

interface GroupTabBadgeViewProps
{
    skipDefault?: boolean;
    setCloseAction: Dispatch<SetStateAction<{ action: () => boolean }>>;
    groupData: IGroupData;
    setGroupData: Dispatch<SetStateAction<IGroupData>>;
}

export const GroupTabBadgeView: FC<GroupTabBadgeViewProps> = props =>
{
    const { groupData = null, setGroupData = null, setCloseAction = null, skipDefault = null } = props;
    const [ badgeParts, setBadgeParts ] = useState<GroupBadgePart[]>(null);
    const { groupCustomize = null } = useGroupsContext();

    const getModifiedBadgeCode = () =>
    {
        if(!badgeParts || !badgeParts.length) return '';

        let badgeCode = '';

        badgeParts.forEach(part => (part.code && (badgeCode += part.code)));

        return badgeCode;
    }

    const saveBadge = useCallback(() =>
    {
        if(!groupData || !badgeParts || !badgeParts.length) return false;

        if((groupData.groupBadgeParts === badgeParts)) return true;

        if(groupData.groupId <= 0)
        {
            setGroupData(prevValue =>
                {
                    const newValue = { ...prevValue };

                    newValue.groupBadgeParts = badgeParts;

                    return newValue;
                });

            return true;
        }

        const badge = [];

        badgeParts.forEach(part =>
        {
            if(!part.code) return;
            
            badge.push(part.key);
            badge.push(part.color);
            badge.push(part.position);
        });
        
        SendMessageHook(new GroupSaveBadgeComposer(groupData.groupId, badge));

        return true;
    }, [ groupData, badgeParts, setGroupData ]);

    useEffect(() =>
    {
        if(groupData.groupBadgeParts) return;
        
        const badgeParts = [
            new GroupBadgePart(GroupBadgePart.BASE, groupCustomize.badgeBases[0].id, groupCustomize.badgePartColors[0].id),
            new GroupBadgePart(GroupBadgePart.SYMBOL, 0, groupCustomize.badgePartColors[0].id),
            new GroupBadgePart(GroupBadgePart.SYMBOL, 0, groupCustomize.badgePartColors[0].id),
            new GroupBadgePart(GroupBadgePart.SYMBOL, 0, groupCustomize.badgePartColors[0].id),
            new GroupBadgePart(GroupBadgePart.SYMBOL, 0, groupCustomize.badgePartColors[0].id)
        ];

        setGroupData(prevValue =>
            {
                const groupBadgeParts = badgeParts;

                return { ...prevValue, groupBadgeParts };
            });
    }, [ groupData.groupBadgeParts, groupCustomize, setGroupData ]);

    useEffect(() =>
    {
        if(groupData.groupId <= 0)
        {
            setBadgeParts(groupData.groupBadgeParts ? [ ...groupData.groupBadgeParts ] : null);

            return;
        }
        
        setBadgeParts(groupData.groupBadgeParts);
    }, [ groupData ]);

    useEffect(() =>
    {
        setCloseAction({ action: saveBadge });

        return () => setCloseAction(null);
    }, [ setCloseAction, saveBadge ]);
    
    return (
        <Grid overflow="hidden" gap={ 1 }>
            <Column size={ 2 }>
                <Flex center className="bg-muted rounded p-1">
                    <BadgeImageView badgeCode={ getModifiedBadgeCode() } isGroup={ true } />
                </Flex>
            </Column>
            <Column size={ 10 } overflow="auto">
                <GroupBadgeCreatorView badgeParts={ badgeParts } setBadgeParts={ setBadgeParts } />
            </Column>
        </Grid>
    );
};
