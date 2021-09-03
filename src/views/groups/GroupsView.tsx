import { GroupBadgePartsComposer, GroupPurchasedEvent, ILinkEventTracker } from '@nitrots/nitro-renderer';
import { FC, useCallback, useEffect, useReducer, useState } from 'react';
import { AddEventLinkTracker, RemoveLinkEventTracker, TryVisitRoom } from '../../api';
import { CreateMessageHook, SendMessageHook } from '../../hooks';
import { GroupsContextProvider } from './context/GroupsContext';
import { GroupsReducer, initialGroups } from './context/GroupsContext.types';
import { GroupsMessageHandler } from './GroupsMessageHandler';
import { GroupCreatorView } from './views/creator/GroupCreatorView';
import { GroupInformationStandaloneView } from './views/information-standalone/GroupInformationStandaloneView';

export const GroupsView: FC<{}> = props =>
{
    const [ groupsState, dispatchGroupsState ] = useReducer(GroupsReducer, initialGroups);

    const [ isCreatorVisible, setIsCreatorVisible ] = useState<boolean>(false);

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
    
    return (
        <GroupsContextProvider value={ { groupsState, dispatchGroupsState } }>
            <GroupsMessageHandler />
            <div className="nitro-groups">
                <GroupCreatorView isVisible={ isCreatorVisible } onClose={ () => setIsCreatorVisible(false) } />
                <GroupInformationStandaloneView />
            </div>
        </GroupsContextProvider>
    );
};
