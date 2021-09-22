import { FriendListFragmentEvent, FriendListUpdateEvent, FriendRequestsEvent, GetFriendRequestsComposer, MessengerInitEvent } from '@nitrots/nitro-renderer';
import { FC, useCallback } from 'react';
import { CreateMessageHook, SendMessageHook } from '../../hooks/messages/message-event';
import { MessengerSettings } from './common/MessengerSettings';
import { useFriendsContext } from './context/FriendsContext';
import { FriendsActions } from './reducers/FriendsReducer';

export const FriendsMessageHandler: FC<{}> = props =>
{
    const { friendsState = null, dispatchFriendsState = null } = useFriendsContext();

    const onMessengerInitEvent = useCallback((event: MessengerInitEvent) =>
    {
        const parser = event.getParser();

        dispatchFriendsState({
            type: FriendsActions.UPDATE_SETTINGS,
            payload: {
                settings: new MessengerSettings(
                    parser.userFriendLimit,
                    parser.normalFriendLimit,
                    parser.extendedFriendLimit,
                    parser.categories)
            }
        });

        SendMessageHook(new GetFriendRequestsComposer());
    }, [ dispatchFriendsState ]);

    const onFriendsFragmentEvent = useCallback((event: FriendListFragmentEvent) =>
    {
        const parser = event.getParser();

        dispatchFriendsState({
            type: FriendsActions.PROCESS_FRAGMENT,
            payload: {
                fragment: parser.fragment
            }
        });
    }, [ dispatchFriendsState ]);

    const onFriendsUpdateEvent = useCallback((event: FriendListUpdateEvent) =>
    {
        const parser = event.getParser();

        dispatchFriendsState({
            type: FriendsActions.PROCESS_UPDATE,
            payload: {
                update: parser
            }
        });
    }, [ dispatchFriendsState ]);

    const onFriendRequestsEvent = useCallback((event: FriendRequestsEvent) =>
    {
        const parser = event.getParser();
        
        dispatchFriendsState({
            type: FriendsActions.PROCESS_REQUESTS,
            payload: {
                requests: parser.requests
            }
        });
    }, [ dispatchFriendsState ]);

    CreateMessageHook(MessengerInitEvent, onMessengerInitEvent);
    CreateMessageHook(FriendListFragmentEvent, onFriendsFragmentEvent);
    CreateMessageHook(FriendListUpdateEvent, onFriendsUpdateEvent);
    CreateMessageHook(FriendRequestsEvent, onFriendRequestsEvent);

    return null;
}
