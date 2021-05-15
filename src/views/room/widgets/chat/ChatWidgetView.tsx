import { RoomObjectCategory, RoomSessionChatEvent } from 'nitro-renderer';
import { useCallback, useEffect, useRef, useState } from 'react';
import { GetRoomEngine, GetRoomSession } from '../../../../api';
import { useRoomSessionManagerEvent } from '../../../../hooks/events/nitro/session/room-session-manager-event';
import { ChatWidgetViewProps } from './ChatWidgetView.types';
import { ChatWidgetMessageView } from './message/ChatWidgetMessageView';
import { ChatBubbleMessage } from './utils/ChatBubbleMessage';
import { GetBubbleLocation } from './utils/ChatWidgetUtilities';

export function ChatWidgetView(props: ChatWidgetViewProps): JSX.Element
{
    const {} = props;
    const [ chatMessages, setChatMessages ] = useState<ChatBubbleMessage[]>([]);
    const elementRef = useRef<HTMLDivElement>();

    const removeLastHiddenChat = useCallback(() =>
    {
        if(!chatMessages.length) return;

        const lastChat = chatMessages[chatMessages.length - 1];

        if((lastChat.lastTop > -(lastChat.height))) return;

        setChatMessages(prevValue =>
            {
                const newMessages = [ ...prevValue ];

                newMessages.splice((newMessages.length - 1), 1);

                return newMessages;
            });
    }, [ chatMessages ]);

    const moveChatUp = useCallback((chat: ChatBubbleMessage, amount: number) =>
    {
        if(!chat.elementRef) return;

        let y = chat.elementRef.offsetHeight;

        if(amount > 0) y = amount;

        let top = (chat.elementRef.offsetTop - y);

        chat.lastTop = top;
        chat.elementRef.style.top = (top + 'px');
    }, []);

    const moveAllChatsUp = useCallback((amount: number) =>
    {
        chatMessages.forEach(chat => moveChatUp(chat, amount));
    }, [ chatMessages, moveChatUp ]);

    const makeRoom = useCallback((amount: number = 0, skipLast: boolean = false) =>
    {
        const lastChat = chatMessages[chatMessages.length - 1];

        if(!lastChat) return;

        const lowestPoint = ((lastChat.lastTop + lastChat.height) - 1);
        const requiredSpace = ((amount || lastChat.height) + 1);
        const spaceAvailable = (elementRef.current.offsetHeight - lowestPoint);

        if(spaceAvailable < requiredSpace)
        {
            amount = (requiredSpace - spaceAvailable);

            chatMessages.forEach((chat, index) =>
                {
                    if(skipLast && (index === (chatMessages.length - 1))) return;

                    moveChatUp(chat, amount)
                });
        }
    }, [ chatMessages, moveChatUp ]);

    const addChat = useCallback((chat: ChatBubbleMessage) =>
    {
        setChatMessages(prevValue =>
            {
                return [ ...prevValue, chat ]
            });
    }, []);

    const onRoomSessionChatEvent = useCallback((event: RoomSessionChatEvent) =>
    {
        const roomObject = GetRoomEngine().getRoomObject(event.session.roomId, event.objectId, RoomObjectCategory.UNIT);

        if(!roomObject) return;

        const canvasId = 1;

        const roomGeometry = GetRoomEngine().getRoomInstanceGeometry(event.session.roomId, canvasId);

        if(!roomGeometry) return;

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

    useEffect(() =>
    {
        const interval = setInterval(() => moveAllChatsUp(15), 500);

        return () =>
        {
            if(interval) clearInterval(interval);
        }
    }, [ chatMessages, moveAllChatsUp ]);

    useEffect(() =>
    {
        const interval = setInterval(() => removeLastHiddenChat(), 500);

        return () =>
        {
            if(interval) clearInterval(interval);
        }
    }, [ removeLastHiddenChat ]);

    return (
        <div ref={ elementRef } className="nitro-chat-widget">
            { chatMessages && (chatMessages.length > 0) && chatMessages.map((chat, index) =>
                {
                    return <ChatWidgetMessageView key={ index } chat={ chat } makeRoom={ makeRoom } />
                })}
        </div>
    );
}
