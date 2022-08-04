import { GroupInformationComposer, GroupInformationEvent, GroupInformationParser, HabboGroupEntryData } from '@nitrots/nitro-renderer';
import { FC, useEffect, useState } from 'react';
import { SendMessageComposer, ToggleFavoriteGroup } from '../../../api';
import { AutoGrid, Base, Column, Flex, Grid, GridProps, LayoutBadgeImageView, LayoutGridItem } from '../../../common';
import { useMessageEvent } from '../../../hooks';
import { GroupInformationView } from '../../groups/views/GroupInformationView';

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
                <Flex justifyContent="center" gap={ 2 }>
                    <Base className="no-group-spritesheet image-1" />
                    <Base className="no-group-spritesheet image-2" />
                    <Base className="no-group-spritesheet image-3" />
                </Flex>
            </Column>
        );
    }
    
    return (
        <Grid overflow={ overflow } gap={ 2 } { ...rest }>
            <Column alignItems="center" size={ 2 } overflow="auto">
                <AutoGrid overflow={ null } columnCount={ 1 } columnMinHeight={ 50 } className="user-groups-container">
                    { groups.map((group, index) =>
                    {
                        return (
                            <LayoutGridItem key={ index } overflow="unset" itemActive={ (selectedGroupId === group.groupId) } onClick={ () => setSelectedGroupId(group.groupId) } className="p-1">
                                { itsMe &&
                                <i className={ 'position-absolute end-0 top-0 z-index-1 icon icon-group-' + (group.favourite ? 'favorite' : 'not-favorite') } onClick={ () => ToggleFavoriteGroup(group) } /> }
                                <LayoutBadgeImageView badgeCode={ group.badgeCode } isGroup={ true } />
                            </LayoutGridItem>
                        )
                    }) }
                </AutoGrid>
            </Column>
            <Column size={ 10 } overflow="hidden">
                { groupInformation &&
                    <GroupInformationView groupInformation={ groupInformation } onClose={ onLeaveGroup } /> }
            </Column>
        </Grid>
    );
}
