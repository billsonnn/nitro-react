import { GetFriendRequestsComposer, MessengerInitEvent } from 'nitro-renderer';
import { useCallback } from 'react';
import { CreateMessageHook, SendMessageHook } from '../../hooks/messages/message-event';
import { FriendListMessageHandlerProps } from './FriendListMessageHandler.types';
import { MessengerSettings } from './utils/MessengerSettings';

export function FriendListMessageHandler(props: FriendListMessageHandlerProps): JSX.Element
{
    const { setMessengerSettings = null } = props;

    const onMessengerInitEvent = useCallback((event: MessengerInitEvent) =>
        {
            const parser = event.getParser();

            setMessengerSettings(new MessengerSettings(
                parser.userFriendLimit,
                parser.normalFriendLimit,
                parser.extendedFriendLimit,
                parser.categories));

            SendMessageHook(new GetFriendRequestsComposer());
        }, [ setMessengerSettings ]);

    CreateMessageHook(MessengerInitEvent, onMessengerInitEvent);

    return null;
}
