import { GroupFavoriteComposer, GroupInformationComposer, GroupInformationEvent, GroupInformationParser, HabboGroupEntryData } from '@nitrots/nitro-renderer';
import classNames from 'classnames';
import { FC, useCallback, useEffect, useState } from 'react';
import { CreateMessageHook, SendMessageHook } from '../../../hooks';
import { BadgeImageView } from '../../../views/shared/badge-image/BadgeImageView';
import { GroupInformationView } from '../../groups/views/GroupInformationView';

interface GroupsContainerViewProps
{
    itsMe: boolean;
    groups: HabboGroupEntryData[];
    onLeaveGroup: () => void;
}

export const GroupsContainerView: FC<GroupsContainerViewProps> = props =>
{
    const { itsMe = null, groups = null, onLeaveGroup = null } = props;

    const [ selectedGroupId, setSelectedGroupId ] = useState<number>(null);
    const [ groupInformation, setGroupInformation ] = useState<GroupInformationParser>(null);

    const onGroupInformationEvent = useCallback((event: GroupInformationEvent) =>
    {
        const parser = event.getParser();

        if(!selectedGroupId || selectedGroupId !== parser.id || parser.flag) return;

        if(groupInformation) setGroupInformation(null);

        setGroupInformation(parser);
    }, [ groupInformation, selectedGroupId ]);

    CreateMessageHook(GroupInformationEvent, onGroupInformationEvent);

    useEffect(() =>
    {
        if(groups.length > 0 && !selectedGroupId) setSelectedGroupId(groups[0].groupId);
    }, [ groups, selectedGroupId ]);

    useEffect(() =>
    {
        if(selectedGroupId) SendMessageHook(new GroupInformationComposer(selectedGroupId, false));
    }, [ selectedGroupId ]);

    const favoriteGroup = useCallback((groupId: number) =>
    {
        SendMessageHook(new GroupFavoriteComposer(groupId));
    }, []);

    if(!groups) return null;
    
    return (
        <div className="d-flex">
            <div className="profile-groups p-2">
                <div className="h-100 overflow-auto d-flex flex-column gap-1">
                    { groups.map((group, index) =>
                        {
                            return <div key={ index } onClick={ () => setSelectedGroupId(group.groupId) } className={ 'profile-groups-item position-relative flex-shrink-0 d-flex align-items-center justify-content-center cursor-pointer' + classNames({ ' active': selectedGroupId === group.groupId }) }>
                                { itsMe && <i className={ 'position-absolute icon icon-group-' + (group.favourite ? 'favorite' : 'not-favorite') } onClick={ () => favoriteGroup(group.groupId) } /> }
                                <BadgeImageView badgeCode={ group.badgeCode } isGroup={ true } />
                            </div>
                        }) }
                </div>
            </div>
            <div className="w-100">
                { groupInformation && <GroupInformationView groupInformation={ groupInformation } onClose={ onLeaveGroup } /> }
            </div>
        </div>
    );
}
