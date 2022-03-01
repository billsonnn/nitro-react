import { NitroPoint, RoomDragEvent } from '@nitrots/nitro-renderer';
import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { RoomWidgetChatSelectAvatarMessage, RoomWidgetRoomObjectMessage, RoomWidgetUpdateChatEvent } from '../../../../api';
import { CreateEventDispatcherHook, useRoomEngineEvent } from '../../../../hooks/events';
import { useRoomContext } from '../../context/RoomContext';
import { ChatWidgetMessageView } from './ChatWidgetMessageView';
import { ChatBubbleMessage } from './common/ChatBubbleMessage';

export const ChatWidgetView: FC<{}> = props =>
{
    const [ chatMessages, setChatMessages ] = useState<ChatBubbleMessage[]>([]);
    const { roomSession = null, eventDispatcher = null, widgetHandler = null } = useRoomContext();
    const elementRef = useRef<HTMLDivElement>();

    const removeHiddenChats = useCallback(() =>
    {
        if(!chatMessages.length) return;

        const newMessages = chatMessages.filter(chat => ((chat.top > (-(chat.height) * 2))));

        if(newMessages.length !== chatMessages.length) setChatMessages(newMessages);
    }, [ chatMessages ]);

    const moveChatUp = useCallback((chat: ChatBubbleMessage, amount: number) =>
    {
        chat.top -= amount;
    }, []);

    const moveAllChatsUp = useCallback((amount: number) =>
    {
        chatMessages.forEach(chat => moveChatUp(chat, amount));

        removeHiddenChats();
    }, [ chatMessages, moveChatUp, removeHiddenChats ]);

    const makeRoom = useCallback((chat: ChatBubbleMessage) =>
    {
        const lowestPoint = ((chat.top + chat.height) - 1);
        const requiredSpace = (chat.height + 1);
        const spaceAvailable = (elementRef.current.offsetHeight - lowestPoint);

        if(spaceAvailable < requiredSpace)
        {
            const amount = (requiredSpace - spaceAvailable);

            chatMessages.forEach(existingChat =>
            {
                if(existingChat === chat) return;

                moveChatUp(existingChat, amount);
            });

            removeHiddenChats();
        }
    }, [ chatMessages, moveChatUp, removeHiddenChats ]);

    const addChat = useCallback((chat: ChatBubbleMessage) => setChatMessages(prevValue => [ ...prevValue, chat ]), []);

    const onRoomWidgetUpdateChatEvent = useCallback((event: RoomWidgetUpdateChatEvent) =>
    {
        const chatMessage = new ChatBubbleMessage(
            event.userId,
            event.userCategory,
            event.roomId,
            event.text,
            event.userName,
            new NitroPoint(event.userX, event.userY),
            event.chatType,
            event.styleId,
            event.userImage,
            (event.userColor && (('#' + (event.userColor.toString(16).padStart(6, '0'))) || null)));

        addChat(chatMessage);
    }, [ addChat ]);

    CreateEventDispatcherHook(RoomWidgetUpdateChatEvent.CHAT_EVENT, eventDispatcher, onRoomWidgetUpdateChatEvent);

    const onRoomDragEvent = useCallback((event: RoomDragEvent) =>
    {
        if(!chatMessages.length) return;

        if(event.roomId !== roomSession.roomId) return;

        chatMessages.forEach(chat =>
            {
                if(!chat.elementRef) return;

                chat.left += event.offsetX;
            });
    }, [ roomSession, chatMessages ]);

    useRoomEngineEvent(RoomDragEvent.ROOM_DRAG, onRoomDragEvent);

    const onChatClicked = useCallback((chat: ChatBubbleMessage) =>
    {
        widgetHandler.processWidgetMessage(new RoomWidgetRoomObjectMessage(RoomWidgetRoomObjectMessage.GET_OBJECT_INFO, chat.senderId, chat.senderCategory));
        widgetHandler.processWidgetMessage(new RoomWidgetChatSelectAvatarMessage(RoomWidgetChatSelectAvatarMessage.MESSAGE_SELECT_AVATAR, chat.senderId, chat.username, chat.roomId));
    }, [ widgetHandler ]);

    useEffect(() =>
    {
        const interval = setInterval(() => moveAllChatsUp(15), 4500);

        return () =>
        {
            if(interval) clearInterval(interval);
        }
    }, [ chatMessages, moveAllChatsUp ]);

    return (
        <div ref={ elementRef } className="nitro-chat-widget">
            { chatMessages.map(chat => <ChatWidgetMessageView key={ chat.id } chat={ chat } makeRoom={ makeRoom } onChatClicked={ onChatClicked } />) }
        </div>
    );
}
