import { GroupBadgePartsComposer, GroupPurchasedEvent, GroupSettingsComposer, ILinkEventTracker } from '@nitrots/nitro-renderer';
import { FC, useCallback, useEffect, useReducer, useState } from 'react';
import { AddEventLinkTracker, RemoveLinkEventTracker, TryVisitRoom } from '../../api';
import { BatchUpdates, CreateMessageHook, SendMessageHook } from '../../hooks';
import { GroupsContextProvider } from './GroupsContext';
import { GroupsMessageHandler } from './GroupsMessageHandler';
import { GroupsReducer, initialGroups } from './reducers/GroupsReducer';
import { GroupCreatorView } from './views/creator/GroupCreatorView';
import { GroupInformationStandaloneView } from './views/information-standalone/GroupInformationStandaloneView';
import { GroupManagerView } from './views/manager/GroupManagerView';
import { GroupMembersView } from './views/members/GroupMembersView';

export const GroupsView: FC<{}> = props =>
{
    const [ currentGroupId, setCurrentGroupId ] = useState<number>(null);
    const [ currentGroupLevelId, setCurrentGroupLevelId ] = useState<number>(null);
    const [ isMembersVisible, setMembersVisible ] = useState<boolean>(false);
    const [ isCreatorVisible, setCreatorVisible ] = useState<boolean>(false);
    const [ groupsState, dispatchGroupsState ] = useReducer(GroupsReducer, initialGroups);

    const closeMembers = () =>
    {
        BatchUpdates(() =>
        {
            setCurrentGroupId(null);
            setCurrentGroupLevelId(null);
        });
    }

    const onGroupPurchasedEvent = useCallback((event: GroupPurchasedEvent) =>
    {
        const parser = event.getParser();

        setCreatorVisible(false);
        TryVisitRoom(parser.roomId);
    }, []);

    CreateMessageHook(GroupPurchasedEvent, onGroupPurchasedEvent);

    const linkReceived = useCallback((url: string) =>
    {
        const parts = url.split('/');

        if(parts.length < 2) return;

        switch(parts[1])
        {
            case 'create':
                setCreatorVisible(true);
                return;
            case 'manage':
                if(!parts[2]) return;
                
                SendMessageHook(new GroupSettingsComposer(Number(parts[2])));
                return;
            case 'members':
                if(!parts[2]) return;

                const groupId = (parseInt(parts[2]) || -1);
                const levelId = (parseInt(parts[3]) || 3);

                BatchUpdates(() =>
                {
                    setCurrentGroupId(groupId);
                    setCurrentGroupLevelId(levelId);
                    setMembersVisible(true);
                });

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

    useEffect(() =>
    {
        SendMessageHook(new GroupBadgePartsComposer());
    }, []);
    
    return (
        <GroupsContextProvider value={ { groupsState, dispatchGroupsState } }>
            <GroupsMessageHandler />
            <div className="nitro-groups">
                <GroupCreatorView isVisible={ isCreatorVisible } onClose={ () => setCreatorVisible(false) } />
                <GroupManagerView />
                { isMembersVisible &&
                    <GroupMembersView groupId={ currentGroupId } levelId={ currentGroupLevelId } setLevelId={ setCurrentGroupLevelId } onClose={ closeMembers } /> }
                <GroupInformationStandaloneView />
            </div>
        </GroupsContextProvider>
    );
};
