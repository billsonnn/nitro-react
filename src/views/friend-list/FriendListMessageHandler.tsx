import { FriendListFragmentEvent, FriendListUpdateEvent, GetFriendRequestsComposer, MessengerInitEvent } from '@nitrots/nitro-renderer';
import { FC, useCallback } from 'react';
import { CreateMessageHook, SendMessageHook } from '../../hooks/messages/message-event';
import { MessengerSettings } from './common/MessengerSettings';
import { useFriendListContext } from './context/FriendListContext';
import { FriendListMessageHandlerProps } from './FriendListMessageHandler.types';
import { FriendListActions } from './reducers/FriendListReducer';

export const FriendListMessageHandler: FC<FriendListMessageHandlerProps> = props =>
{
    const { friendListState = null, dispatchFriendListState = null } = useFriendListContext();

    const onMessengerInitEvent = useCallback((event: MessengerInitEvent) =>
    {
        const parser = event.getParser();

        dispatchFriendListState({
            type: FriendListActions.UPDATE_SETTINGS,
            payload: {
                settings: new MessengerSettings(
                    parser.userFriendLimit,
                    parser.normalFriendLimit,
                    parser.extendedFriendLimit,
                    parser.categories)
            }
        });

        SendMessageHook(new GetFriendRequestsComposer());
    }, [ dispatchFriendListState ]);

    const onFriendListFragmentEvent = useCallback((event: FriendListFragmentEvent) =>
    {
        const parser = event.getParser();

        dispatchFriendListState({
            type: FriendListActions.PROCESS_FRAGMENT,
            payload: {
                fragment: parser.fragment
            }
        });
    }, [ dispatchFriendListState ]);

    const onFriendListUpdateEvent = useCallback((event: FriendListUpdateEvent) =>
    {
        const parser = event.getParser();

        dispatchFriendListState({
            type: FriendListActions.PROCESS_UPDATE,
            payload: {
                update: parser
            }
        });
    }, [ dispatchFriendListState ]);

    CreateMessageHook(MessengerInitEvent, onMessengerInitEvent);
    CreateMessageHook(FriendListFragmentEvent, onFriendListFragmentEvent);
    CreateMessageHook(FriendListUpdateEvent, onFriendListUpdateEvent);

    return null;
}
