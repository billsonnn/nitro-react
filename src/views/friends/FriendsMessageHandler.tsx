import { FriendListFragmentEvent, FriendListUpdateEvent, FriendRequestsEvent, GetFriendRequestsComposer, MessengerInitEvent, NewConsoleMessageEvent } from '@nitrots/nitro-renderer';
import { FC, useCallback } from 'react';
import { GetSessionDataManager } from '../../api';
import { CreateMessageHook, SendMessageHook } from '../../hooks/messages/message-event';
import { MessengerChatMessage } from './common/MessengerChatMessage';
import { MessengerSettings } from './common/MessengerSettings';
import { useFriendsContext } from './context/FriendsContext';
import { FriendsActions } from './reducers/FriendsReducer';

export const FriendsMessageHandler: FC<{}> = props =>
{
    const { friendsState = null, dispatchFriendsState = null } = useFriendsContext();
    const { activeChats = [] } = friendsState;

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

    const onNewConsoleMessageEvent = useCallback((event: NewConsoleMessageEvent) =>
    {
        const parser = event.getParser();

        let userId = parser.senderId;

        if(userId === GetSessionDataManager().userId) userId = 0;

        dispatchFriendsState({
            type: FriendsActions.ADD_CHAT_MESSAGE,
            payload: {
                chatMessage: new MessengerChatMessage(MessengerChatMessage.MESSAGE, userId, parser.messageText, parser.secondsSinceSent, parser.extraData)
            }
        });
    }, [ dispatchFriendsState ]);

    CreateMessageHook(MessengerInitEvent, onMessengerInitEvent);
    CreateMessageHook(FriendListFragmentEvent, onFriendsFragmentEvent);
    CreateMessageHook(FriendListUpdateEvent, onFriendsUpdateEvent);
    CreateMessageHook(FriendRequestsEvent, onFriendRequestsEvent);
    CreateMessageHook(NewConsoleMessageEvent, onNewConsoleMessageEvent);

    return null;
}
