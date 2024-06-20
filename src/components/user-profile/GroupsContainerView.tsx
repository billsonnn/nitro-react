import { GroupInformationComposer, GroupInformationEvent, GroupInformationParser, HabboGroupEntryData } from '@nitrots/nitro-renderer';
import { FC, useEffect, useState } from 'react';
import { SendMessageComposer, ToggleFavoriteGroup } from '../../api';
import { AutoGrid, Column, Grid, GridProps, LayoutBadgeImageView, LayoutGridItem } from '../../common';
import { useMessageEvent } from '../../hooks';
import { GroupInformationView } from '../groups/views/GroupInformationView';

interface GroupsContainerViewProps extends GridProps
{
    itsMe: boolean;
    groups: HabboGroupEntryData[];
    onLeaveGroup: () => void;
}

export const GroupsContainerView: FC<GroupsContainerViewProps> = props =>
{
    const { itsMe = null, groups = null, onLeaveGroup = null, overflow = 'hidden', gap = 2, ...rest } = props;
    const [ selectedGroupId, setSelectedGroupId ] = useState<number>(null);
    const [ groupInformation, setGroupInformation ] = useState<GroupInformationParser>(null);

    useMessageEvent<GroupInformationEvent>(GroupInformationEvent, event =>
    {
        const parser = event.getParser();

        if(!selectedGroupId || (selectedGroupId !== parser.id) || parser.flag) return;

        setGroupInformation(parser);
    });

    useEffect(() =>
    {
        if(!selectedGroupId) return;

        SendMessageComposer(new GroupInformationComposer(selectedGroupId, false));
    }, [ selectedGroupId ]);

    useEffect(() =>
    {
        setGroupInformation(null);

        if(groups.length > 0)
        {
            setSelectedGroupId(prevValue =>
            {
                if(prevValue === groups[0].groupId)
                {
                    SendMessageComposer(new GroupInformationComposer(groups[0].groupId, false));
                }

                return groups[0].groupId;
            });
        }
    }, [ groups ]);

    if(!groups || !groups.length)
    {
        return (
            <Column center fullHeight>
                <div className="flex justify-center gap-2">
                    <div className="no-group-spritesheet image-1" />
                    <div className="no-group-spritesheet image-2" />
                    <div className="no-group-spritesheet image-3" />
                </div>
            </Column>
        );
    }

    return (
        <Grid gap={ 2 } overflow={ overflow } { ...rest }>
            <Column alignItems="center" overflow="auto" size={ 2 }>
                <AutoGrid className="w-[50px]" columnCount={ 1 } columnMinHeight={ 50 } overflow={ null }>
                    { groups.map((group, index) =>
                    {
                        return (
                            <LayoutGridItem key={ index } className="p-1" itemActive={ (selectedGroupId === group.groupId) } overflow="unset" onClick={ () => setSelectedGroupId(group.groupId) }>
                                { itsMe &&
                                    <i className={ 'absolute end-0 top-0 z-20 nitro-icon icon-group-' + (group.favourite ? 'favorite' : 'not-favorite') } onClick={ () => ToggleFavoriteGroup(group) } /> }
                                <LayoutBadgeImageView badgeCode={ group.badgeCode } isGroup={ true } />
                            </LayoutGridItem>
                        );
                    }) }
                </AutoGrid>
            </Column>
            <Column overflow="hidden" size={ 10 }>
                { groupInformation &&
                    <GroupInformationView groupInformation={ groupInformation } onClose={ onLeaveGroup } /> }
            </Column>
        </Grid>
    );
};
