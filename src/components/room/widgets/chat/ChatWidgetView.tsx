import { IWorkerEventTracker, RoomChatSettings } from '@nitrots/nitro-renderer';
import { FC, useEffect, useRef, useState } from 'react';
import { AddWorkerEventTracker, ChatBubbleMessage, DoChatsOverlap, GetConfiguration, RemoveWorkerEventTracker, SendWorkerEvent } from '../../../../api';
import { useChatWidget } from '../../../../hooks';
import { ChatWidgetMessageView } from './ChatWidgetMessageView';

let TIMER_TRACKER: number = 0;

export const ChatWidgetView: FC<{}> = props =>
{
    const [ timerId, setTimerId ] = useState(TIMER_TRACKER++);
    const { chatMessages = [], setChatMessages = null, chatSettings = null, getScrollSpeed = 6000, removeHiddenChats = null, moveAllChatsUp = null } = useChatWidget();
    const elementRef = useRef<HTMLDivElement>();

    const checkOverlappingChats = (chat: ChatBubbleMessage, moved: number, tempChats: ChatBubbleMessage[]) => 
    {
        const totalChats = chatMessages.length;

        if(!totalChats) return;

        for(let i = (totalChats - 1); i >= 0; i--)
        {
            const collides = chatMessages[i];

            if(!collides || (chat === collides) || (tempChats.indexOf(collides) >= 0) || (((collides.top + collides.height) - moved) > (chat.top + chat.height))) continue;

            chat.skipMovement = true;

            if(DoChatsOverlap(chat, collides, -moved, 0))
            {
                const amount = Math.abs((collides.top + collides.height) - chat.top);

                tempChats.push(collides);

                collides.top -= amount;
                collides.skipMovement = true;

                checkOverlappingChats(collides, amount, tempChats);
            }
        }
    }

    const makeRoom = (chat: ChatBubbleMessage) =>
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
    }

    useEffect(() =>
    {
        const resize = (event: UIEvent = null) =>
        {
            if(!elementRef || !elementRef.current) return;

            const currentHeight = elementRef.current.offsetHeight;
            const newHeight = Math.round(document.body.offsetHeight * GetConfiguration<number>('chat.viewer.height.percentage'));

            elementRef.current.style.height = `${ newHeight }px`;

            setChatMessages(prevValue =>
            {
                if(prevValue)
                {
                    prevValue.forEach(chat => (chat.top -= (currentHeight - newHeight)));
                }
    
                return prevValue;
            });
        }

        window.addEventListener('resize', resize);

        resize();

        return () =>
        {
            window.removeEventListener('resize', resize);
        }
    }, [ setChatMessages ]);

    useEffect(() =>
    {
        const workerTracker: IWorkerEventTracker = {
            workerMessageReceived: (message: { [index: string]: any }) =>
            {
                switch(message.type)
                {
                    case 'MOVE_CHATS':
                        moveAllChatsUp(15);
                        return;
                }
            }
        };

        AddWorkerEventTracker(workerTracker);

        SendWorkerEvent({
            type: 'CREATE_INTERVAL',
            time: getScrollSpeed,
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
    }, [ timerId, getScrollSpeed, moveAllChatsUp ]);

    return (
        <div ref={ elementRef } className="nitro-chat-widget">
            { chatMessages.map(chat => <ChatWidgetMessageView key={ chat.id } chat={ chat } makeRoom={ makeRoom } bubbleWidth={ chatSettings.weight } />) }
        </div>
    );
}
