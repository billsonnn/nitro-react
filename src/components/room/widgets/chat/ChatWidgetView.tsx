import { GetGuestRoomResultEvent, IWorkerEventTracker, NitroPoint, RoomChatSettings, RoomChatSettingsEvent, RoomDragEvent } from '@nitrots/nitro-renderer';
import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { AddWorkerEventTracker, GetConfiguration, RemoveWorkerEventTracker, RoomChatFormatter, RoomWidgetChatSelectAvatarMessage, RoomWidgetRoomObjectMessage, RoomWidgetUpdateChatEvent, SendWorkerEvent } from '../../../../api';
import { UseEventDispatcherHook, UseMessageEventHook, UseRoomEngineEvent } from '../../../../hooks';
import { useRoomContext } from '../../RoomContext';
import { ChatWidgetMessageView } from './ChatWidgetMessageView';
import { ChatBubbleMessage } from './common/ChatBubbleMessage';
import { DoChatsOverlap } from './common/DoChatsOverlap';

let TIMER_TRACKER: number = 0;

export const ChatWidgetView: FC<{}> = props =>
{
    const [ chatSettings, setChatSettings ] = useState<RoomChatSettings>(null);
    const [ chatMessages, setChatMessages ] = useState<ChatBubbleMessage[]>([]);
    const [ timerId, setTimerId ] = useState(TIMER_TRACKER++);
    const { roomSession = null, eventDispatcher = null, widgetHandler = null } = useRoomContext();
    const elementRef = useRef<HTMLDivElement>();

    const removeHiddenChats = useCallback(() =>
    {
        setChatMessages(prevValue =>
            {
                if(prevValue)
                {
                    const newMessages = prevValue.filter(chat => ((chat.top > (-(chat.height) * 2))));

                    if(newMessages.length !== prevValue.length) return newMessages;
                }

                return prevValue;
            })
    }, []);

    const moveAllChatsUp = useCallback((amount: number) =>
    {
        setChatMessages(prevValue =>
            {
                if(prevValue)
                {
                    prevValue.forEach(chat =>
                        {
                            if(chat.skipMovement)
                            {
                                chat.skipMovement = false;
            
                                return;
                            }
            
                            chat.top -= amount;
                        });
                }

                return prevValue;
            });

        removeHiddenChats();
    }, [ removeHiddenChats ]);

    const checkOverlappingChats = useCallback((chat: ChatBubbleMessage, moved: number, tempChats: ChatBubbleMessage[]) => 
    {
        const totalChats = chatMessages.length;

        if(!totalChats) return;

        for(let i = (totalChats - 1); i >= 0; i--)
        {
            const collides = chatMessages[i];

            if(!collides || (chat === collides) || (tempChats.indexOf(collides) >= 0) || ((collides.top - moved) >= (chat.top + chat.height))) continue;

            if(DoChatsOverlap(chat, collides, -moved, 4))
            {
                const amount = Math.abs((collides.top + collides.height) - chat.top);

                tempChats.push(collides);

                collides.top -= amount;

                collides.skipMovement = true;

                checkOverlappingChats(collides, amount, tempChats);
            }
        }
    }, [ chatMessages ]);

    const makeRoom = useCallback((chat: ChatBubbleMessage) =>
    {
        if(chatSettings.mode === RoomChatSettings.CHAT_MODE_FREE_FLOW)
        {
            chat.skipMovement = true;

            checkOverlappingChats(chat, 0, [ chat ]);

            removeHiddenChats();
        }
        else
        {
            const lowestPoint = (chat.top + chat.height);
            const requiredSpace = chat.height;
            const spaceAvailable = (elementRef.current.offsetHeight - lowestPoint);
            const amount = (requiredSpace - spaceAvailable);

            if(spaceAvailable < requiredSpace)
            {
                chatMessages.forEach(existingChat =>
                {
                    if(existingChat === chat) return;

                    existingChat.top -= amount;
                });

                removeHiddenChats();
            }
        }
    }, [ chatSettings, chatMessages, removeHiddenChats, checkOverlappingChats ]);

    const onRoomWidgetUpdateChatEvent = useCallback((event: RoomWidgetUpdateChatEvent) =>
    {
        const chatMessage = new ChatBubbleMessage(
            event.userId,
            event.userCategory,
            event.roomId,
            event.text,
            RoomChatFormatter(event.text),
            event.userName,
            new NitroPoint(event.userX, event.userY),
            event.chatType,
            event.styleId,
            event.userImage,
            (event.userColor && (('#' + (event.userColor.toString(16).padStart(6, '0'))) || null)));

        setChatMessages(prevValue => [ ...prevValue, chatMessage ]);
    }, []);

    UseEventDispatcherHook(RoomWidgetUpdateChatEvent.CHAT_EVENT, eventDispatcher, onRoomWidgetUpdateChatEvent);

    const onRoomDragEvent = useCallback((event: RoomDragEvent) =>
    {
        if(!chatMessages.length || (event.roomId !== roomSession.roomId)) return;

        chatMessages.forEach(chat => (chat.elementRef && (chat.left += event.offsetX)));
    }, [ roomSession, chatMessages ]);

    UseRoomEngineEvent(RoomDragEvent.ROOM_DRAG, onRoomDragEvent);

    const onChatClicked = useCallback((chat: ChatBubbleMessage) =>
    {
        widgetHandler.processWidgetMessage(new RoomWidgetRoomObjectMessage(RoomWidgetRoomObjectMessage.GET_OBJECT_INFO, chat.senderId, chat.senderCategory));
        widgetHandler.processWidgetMessage(new RoomWidgetChatSelectAvatarMessage(RoomWidgetChatSelectAvatarMessage.MESSAGE_SELECT_AVATAR, chat.senderId, chat.username, chat.roomId));
    }, [ widgetHandler ]);

    const getScrollSpeed = useCallback(() =>
    {
        if(!chatSettings) return 6000;

        switch(chatSettings.speed)
        {
            case RoomChatSettings.CHAT_SCROLL_SPEED_FAST:
                return 3000;
            case RoomChatSettings.CHAT_SCROLL_SPEED_NORMAL:
                return 6000;
            case RoomChatSettings.CHAT_SCROLL_SPEED_SLOW:
                return 12000;
        }
    }, [ chatSettings ])

    const onGetGuestRoomResultEvent = useCallback((event: GetGuestRoomResultEvent) =>
    {
        const parser = event.getParser();

        if(!parser.roomEnter) return;
        
        setChatSettings(parser.chat);
    }, []);

    UseMessageEventHook(GetGuestRoomResultEvent, onGetGuestRoomResultEvent);

    const onRoomChatSettingsEvent = useCallback((event: RoomChatSettingsEvent) =>
    {
        const parser = event.getParser();
        
        setChatSettings(parser.chat);
    }, []);

    UseMessageEventHook(RoomChatSettingsEvent, onRoomChatSettingsEvent);

    useEffect(() =>
    {
        if(!elementRef || !elementRef.current) return;

        elementRef.current.style.height = ((document.body.offsetHeight * GetConfiguration<number>('chat.viewer.height.percentage')) + 'px');
    }, []);

    const workerMessageReceived = useCallback((message: { [index: string]: any }) =>
    {
        switch(message.type)
        {
            case 'MOVE_CHATS':
                moveAllChatsUp(15);
                return;
        }
    }, [ moveAllChatsUp ]);

    useEffect(() =>
    {
        const workerTracker: IWorkerEventTracker = {
            workerMessageReceived
        };

        AddWorkerEventTracker(workerTracker);

        SendWorkerEvent({
            type: 'CREATE_INTERVAL',
            time: getScrollSpeed(),
            timerId: timerId,
            response: { type: 'MOVE_CHATS' }
        });

        return () =>
        {
            SendWorkerEvent({
                type: 'REMOVE_INTERVAL',
                timerId
            });
            
            RemoveWorkerEventTracker(workerTracker);
        }
    }, [ timerId, workerMessageReceived, getScrollSpeed ]);

    return (
        <div ref={ elementRef } className="nitro-chat-widget">
            {chatMessages.map(chat => <ChatWidgetMessageView key={chat.id} chat={chat} makeRoom={makeRoom} onChatClicked={onChatClicked} bubbleWidth={ chatSettings.weight }/>)}
        </div>
    );
}
