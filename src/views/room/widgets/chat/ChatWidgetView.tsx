import { RoomDragEvent, RoomObjectCategory, RoomSessionChatEvent } from 'nitro-renderer';
import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { GetRoomEngine, GetRoomSession } from '../../../../api';
import { useRoomEngineEvent } from '../../../../hooks/events';
import { useRoomSessionManagerEvent } from '../../../../hooks/events/nitro/session/room-session-manager-event';
import { useRoomContext } from '../../context/RoomContext';
import { ChatWidgetViewProps } from './ChatWidgetView.types';
import { ChatWidgetMessageView } from './message/ChatWidgetMessageView';
import { ChatBubbleMessage } from './utils/ChatBubbleMessage';
import { GetBubbleLocation } from './utils/ChatWidgetUtilities';

export const ChatWidgetView: FC<ChatWidgetViewProps> = props =>
{
    const [ chatMessages, setChatMessages ] = useState<ChatBubbleMessage[]>([]);
    const { roomSession = null } = useRoomContext();
    const elementRef = useRef<HTMLDivElement>();

    const removeFirstHiddenChat = useCallback(() =>
    {
        if(!chatMessages.length) return;

        const lastChat = chatMessages[0];
        
        if((lastChat.top > (-(lastChat.height) * 2))) return;

        setChatMessages(prevValue =>
            {
                const newMessages = [ ...prevValue ];

                newMessages.shift();

                return newMessages;
            });
    }, [ chatMessages ]);

    const moveChatUp = useCallback((chat: ChatBubbleMessage, amount: number) =>
    {
        chat.top -= amount;
    }, []);

    const moveAllChatsUp = useCallback((amount: number) =>
    {
        chatMessages.forEach(chat => moveChatUp(chat, amount));

        removeFirstHiddenChat();
    }, [ chatMessages, moveChatUp, removeFirstHiddenChat ]);

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
        }
    }, [ chatMessages, moveChatUp ]);

    const addChat = useCallback((chat: ChatBubbleMessage) =>
    {
        setChatMessages(prevValue =>
            {
                return [ ...prevValue, chat ];
            });
    }, []);

    const onRoomSessionChatEvent = useCallback((event: RoomSessionChatEvent) =>
    {
        const roomObject = GetRoomEngine().getRoomObject(event.session.roomId, event.objectId, RoomObjectCategory.UNIT);

        if(!roomObject) return;

        const canvasId = 1;
        const objectLocation = roomObject.getLocation();
        const bubbleLocation = GetBubbleLocation(event.session.roomId, objectLocation, canvasId);
        const userData = GetRoomSession().userDataManager.getUserDataByIndex(event.objectId);

        let username = '';
        let avatarColor = '';
        let imageUrl: string = null;
        let chatType = event.chatType;
        let styleId = event.style;
        let userType = 0;
        let petType = -1;
        let text = event.message;

        if(userData)
        {
            userType = userData.type;

            const figure = userData.figure;

            // switch(userType)
            // {
            //     case RoomObjectType.PET:
            //         image   = this.getPetImage(figure, 2, true, 64, roomObject.model.getValue<string>(RoomObjectVariable.FIGURE_POSTURE));
            //         petType = new PetFigureData(figure).typeId;
            //         break;
            //     case RoomObjectType.USER:
            //         image = this.getUserImage(figure);
            //         break;
            //     case RoomObjectType.RENTABLE_BOT:
            //     case RoomObjectType.BOT:
            //         styleId = SystemChatStyleEnum.BOT;
            //         break;
            // }

            //avatarColor = this._avatarColorCache.get(figure);
            username    = userData.name;
        }

        const chatMessage = new ChatBubbleMessage(
            text,
            username,
            bubbleLocation,
            chatType,
            styleId,
            imageUrl,
            avatarColor
        );

        addChat(chatMessage);
    }, [ addChat ]);

    useRoomSessionManagerEvent(RoomSessionChatEvent.CHAT_EVENT, onRoomSessionChatEvent);

    const onRoomDragEvent = useCallback((event: RoomDragEvent) =>
    {
        if(!chatMessages.length) return;

        if(event.roomId !== roomSession.roomId) return;

        chatMessages.forEach(chat =>
            {
                if(!chat.elementRef) return;

                chat.left = (chat.elementRef.offsetLeft + event.offsetX);
            });
    }, [ roomSession, chatMessages ]);

    useRoomEngineEvent(RoomDragEvent.ROOM_DRAG, onRoomDragEvent);

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
            { chatMessages.map(chat =>
                {
                    return <ChatWidgetMessageView key={ chat.id } chat={ chat } makeRoom={ makeRoom } />
                })}
        </div>
    );
}
