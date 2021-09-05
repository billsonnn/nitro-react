import { GroupBadgePartsComposer, GroupPurchasedEvent, GroupSettingsComposer, ILinkEventTracker } from '@nitrots/nitro-renderer';
import { FC, useCallback, useEffect, useReducer, useState } from 'react';
import { AddEventLinkTracker, RemoveLinkEventTracker, TryVisitRoom } from '../../api';
import { CreateMessageHook, SendMessageHook } from '../../hooks';
import { GroupsContextProvider } from './context/GroupsContext';
import { GroupsReducer, initialGroups } from './context/GroupsContext.types';
import { GroupsMessageHandler } from './GroupsMessageHandler';
import { GroupCreatorView } from './views/creator/GroupCreatorView';
import { GroupInformationStandaloneView } from './views/information-standalone/GroupInformationStandaloneView';
import { GroupManagerView } from './views/manager/GroupManagerView';
import { GroupMembersView } from './views/members/GroupMembersView';

export const GroupsView: FC<{}> = props =>
{
    const [ groupsState, dispatchGroupsState ] = useReducer(GroupsReducer, initialGroups);

    const [ isCreatorVisible, setIsCreatorVisible ] = useState<boolean>(false);
    const [ groupMembersId, setGroupMembersId ] = useState<number>(null);
    const [ groupMembersLevel, setGroupMembersLevel ] = useState<number>(null);

    useEffect(() =>
    {
        SendMessageHook(new GroupBadgePartsComposer());
    }, []);

    const linkReceived = useCallback((url: string) =>
    {
        const parts = url.split('/');

        if(parts.length < 2) return;

        switch(parts[1])
        {
            case 'create':
                setIsCreatorVisible(true);
                return;
            case 'manage':
                if(!parts[2]) return;
                
                SendMessageHook(new GroupSettingsComposer(Number(parts[2])));
                return;
            case 'members':
                if(!parts[2]) return;
                
                setGroupMembersId(Number(parts[2]));

                if(parts[3]) setGroupMembersLevel(Number(parts[3]));
                return;
        }
    }, []);

    useEffect(() =>
    {
        const linkTracker: ILinkEventTracker = {
            linkReceived,
            eventUrlPrefix: 'groups/'
        };

        AddEventLinkTracker(linkTracker);

        return () => RemoveLinkEventTracker(linkTracker);
    }, [ linkReceived ]);

    const onGroupPurchasedEvent = useCallback((event: GroupPurchasedEvent) =>
    {
        const parser = event.getParser();

        setIsCreatorVisible(false);
        TryVisitRoom(parser.roomId);
    }, []);

    CreateMessageHook(GroupPurchasedEvent, onGroupPurchasedEvent);

    const closeMembers = useCallback(() =>
    {
        setGroupMembersId(null);
        setGroupMembersLevel(null);
    }, []);
    
    return (
        <GroupsContextProvider value={ { groupsState, dispatchGroupsState } }>
            <GroupsMessageHandler />
            <div className="nitro-groups">
                <GroupCreatorView isVisible={ isCreatorVisible } onClose={ () => setIsCreatorVisible(false) } />
                <GroupManagerView />
                <GroupMembersView groupId={ groupMembersId } levelId={ groupMembersLevel } onClose={ closeMembers } />
                <GroupInformationStandaloneView />
            </div>
        </GroupsContextProvider>
    );
};
