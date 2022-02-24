import { GroupSaveBadgeComposer } from '@nitrots/nitro-renderer';
import { FC, useEffect, useState } from 'react';
import { Column, Flex, Grid } from '../../../../common';
import { SendMessageHook } from '../../../../hooks';
import { BadgeImageView } from '../../../../views/shared/badge-image/BadgeImageView';
import { GroupBadgePart } from '../../common/GroupBadgePart';
import { useGroupsContext } from '../../GroupsContext';
import { GroupsActions } from '../../reducers/GroupsReducer';
import { GroupBadgeCreatorView } from '../GroupBadgeCreatorView';

const POSITIONS: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8];

interface GroupTabBadgeViewProps
{
    skipDefault?: boolean;
}

export const GroupTabBadgeView: FC<GroupTabBadgeViewProps> = props =>
{
    const { skipDefault = null } = props;
    const [ badgeParts, setBadgeParts ] = useState<GroupBadgePart[]>(null);
    const { groupsState = null, dispatchGroupsState = null } = useGroupsContext();
    const { badgeBases = null, badgeSymbols = null, badgePartColors = null, groupId = -1, groupBadgeParts = null } = groupsState;

    const getModifiedBadgeCode = () =>
    {
        if(!badgeParts || !badgeParts.length) return '';

        let badgeCode = '';

        badgeParts.forEach(part => (part.code && (badgeCode += part.code)));

        return badgeCode;
    }

    useEffect(() =>
    {
        if(groupBadgeParts && groupBadgeParts.length) return;
        
        const badgeParts = [
            new GroupBadgePart(GroupBadgePart.BASE, badgeBases[0].id, badgePartColors[0].id),
            new GroupBadgePart(GroupBadgePart.SYMBOL, 0, badgePartColors[0].id),
            new GroupBadgePart(GroupBadgePart.SYMBOL, 0, badgePartColors[0].id),
            new GroupBadgePart(GroupBadgePart.SYMBOL, 0, badgePartColors[0].id),
            new GroupBadgePart(GroupBadgePart.SYMBOL, 0, badgePartColors[0].id)
        ];

        dispatchGroupsState({
            type: GroupsActions.SET_GROUP_BADGE_PARTS,
            payload: { badgeParts }
        });
    }, [ groupBadgeParts, badgeBases, badgePartColors, dispatchGroupsState ]);

    useEffect(() =>
    {
        setBadgeParts(groupBadgeParts);
    }, [ groupBadgeParts ]);

    useEffect(() =>
    {
        if((groupId <= 0) || !badgeParts || !badgeParts.length || !groupBadgeParts || !groupBadgeParts.length || (badgeParts === groupBadgeParts)) return;

        const badge = [];

        badgeParts.forEach((part) =>
        {
            if(!part.code) return;
            
            badge.push(part.key);
            badge.push(part.color);
            badge.push(part.position);
        });

        console.log('send')
        
        SendMessageHook(new GroupSaveBadgeComposer(groupId, badge));
    }, [ groupId, badgeParts, groupBadgeParts ]);

    // useEffect(() =>
    // {
    //     if((groupId <= 0) || !badgeParts || !badgeParts.length || (badgeParts === groupBadgeParts)) return;

    //     const badge = [];

    //     badgeParts.forEach((part) =>
    //     {
    //         if(!part.code) return;
            
    //         badge.push(part.key);
    //         badge.push(part.color);
    //         badge.push(part.position);
    //     });

    //     console.log('send')
        
    //     SendMessageHook(new GroupSaveBadgeComposer(groupId, badge));
    // }, [ groupId, groupBadgeParts, badgeParts ]);
    
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
