import { RoomChatSettings } from '@nitrots/nitro-renderer';
import { FC, useCallback, useEffect, useRef } from 'react';
import { ChatBubbleMessage, DoChatsOverlap, GetConfiguration } from '../../../../api';
import { useChatWidget } from '../../../../hooks';
import IntervalWebWorker from '../../../../workers/IntervalWebWorker';
import { WorkerBuilder } from '../../../../workers/WorkerBuilder';
import { ChatWidgetMessageView } from './ChatWidgetMessageView';

export const ChatWidgetView: FC<{}> = props =>
{
    const { chatMessages = [], setChatMessages = null, chatSettings = null, getScrollSpeed = 6000 } = useChatWidget();
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
    }, [ setChatMessages ]);

    const checkOverlappingChats = useCallback((chat: ChatBubbleMessage, moved: number, tempChats: ChatBubbleMessage[]) => 
    {
        for(let i = (chatMessages.indexOf(chat) - 1); i >= 0; i--)
        {
            const collides = chatMessages[i];

            if(!collides || (chat === collides) || (tempChats.indexOf(collides) >= 0) || (((collides.top + collides.height) - moved) > (chat.top + chat.height))) continue;

            if(DoChatsOverlap(chat, collides, -moved, 0))
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
                setChatMessages(prevValue =>
                {
                    prevValue.forEach(prevChat =>
                    {
                        if(prevChat === chat) return;

                        prevChat.top -= amount;
                    });

                    return prevValue;
                });

                removeHiddenChats();
            }
        }
    }, [ chatSettings, checkOverlappingChats, removeHiddenChats, setChatMessages ]);

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
        const moveAllChatsUp = (amount: number) =>
        {
            setChatMessages(prevValue =>
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

                return prevValue;
            });

            removeHiddenChats();
        }

        const worker = new WorkerBuilder(IntervalWebWorker);

        worker.onmessage = () => moveAllChatsUp(15);

        worker.postMessage({ action: 'START', content: getScrollSpeed });

        return () =>
        {
            worker.postMessage({ action: 'STOP' });
        }
    }, [ getScrollSpeed, removeHiddenChats, setChatMessages ]);

    return (
        <div ref={ elementRef } className="nitro-chat-widget">
            { chatMessages.map(chat => <ChatWidgetMessageView key={ chat.id } chat={ chat } makeRoom={ makeRoom } bubbleWidth={ chatSettings.weight } />) }
        </div>
    );
}
