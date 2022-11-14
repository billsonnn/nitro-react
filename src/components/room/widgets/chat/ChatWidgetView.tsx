import { RoomChatSettings } from '@nitrots/nitro-renderer';
import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { ChatBubbleMessage, DoChatsOverlap, GetConfiguration } from '../../../../api';
import { useChatWidget } from '../../../../hooks';
import IntervalWebWorker from '../../../../workers/IntervalWebWorker';
import { WorkerBuilder } from '../../../../workers/WorkerBuilder';
import { ChatWidgetMessageView } from './ChatWidgetMessageView';

let TIMER_TRACKER: number = 0;

export const ChatWidgetView: FC<{}> = props =>
{
    const [ timerId, setTimerId ] = useState(TIMER_TRACKER++);
    const { pendingChats = null, chatSettings = null, getScrollSpeed = 6000 } = useChatWidget();
    const [ renderedChats, setRenderedChats ] = useState<ChatBubbleMessage[]>([]);
    const elementRef = useRef<HTMLDivElement>();
    const isProcessing = useRef<boolean>(false);

    const removeHiddenChats = useCallback(() =>
    {
        setRenderedChats(prevValue =>
        {
            if(prevValue)
            {
                const newMessages = prevValue.filter(chat => ((chat.top > (-(chat.height) * 2))));

                if(newMessages.length !== prevValue.length) return newMessages;
            }

            return prevValue;
        })
    }, []);

    const checkOverlappingChats = useCallback((chat: ChatBubbleMessage, moved: number, tempChats: ChatBubbleMessage[]) => 
    {
        const totalChats = renderedChats.length;

        if(!totalChats) return;

        for(let i = (totalChats - 1); i >= 0; i--)
        {
            const collides = renderedChats[i];

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
    }, [ renderedChats ]);

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
                setRenderedChats(prevValue =>
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
    }, [ chatSettings, checkOverlappingChats, removeHiddenChats ]);

    const onBubbleReady = useCallback(() =>
    {
        isProcessing.current = false;
    }, []);

    useEffect(() =>
    {
        const resize = (event: UIEvent = null) =>
        {
            if(!elementRef || !elementRef.current) return;

            const currentHeight = elementRef.current.offsetHeight;
            const newHeight = Math.round(document.body.offsetHeight * GetConfiguration<number>('chat.viewer.height.percentage'));

            elementRef.current.style.height = `${ newHeight }px`;

            setRenderedChats(prevValue =>
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
    }, []);

    useEffect(() =>
    {
        const processNextChat = () =>
        {
            if(isProcessing.current) return;

            const chat = pendingChats?.current?.shift();

            if(!chat) return;

            isProcessing.current = true;

            setRenderedChats(prevValue => [ ...prevValue, chat ]);
        }

        const worker = new WorkerBuilder(IntervalWebWorker);

        worker.onmessage = () => processNextChat();

        worker.postMessage({ action: 'START', content: 50 });

        return () =>
        {
            worker.postMessage({ action: 'STOP' });
        }
    }, [ pendingChats ]);

    useEffect(() =>
    {
        const moveAllChatsUp = (amount: number) =>
        {
            setRenderedChats(prevValue =>
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

        worker.onmessage = () =>
        {
            moveAllChatsUp(15);
        }

        worker.postMessage({ action: 'START', content: getScrollSpeed });

        return () =>
        {
            worker.postMessage({ action: 'STOP' });
        }
    }, [ getScrollSpeed, removeHiddenChats ]);

    return (
        <div ref={ elementRef } className="nitro-chat-widget">
            { renderedChats.map(chat => <ChatWidgetMessageView key={ chat.id } chat={ chat } makeRoom={ makeRoom } onBubbleReady={ onBubbleReady } bubbleWidth={ chatSettings.weight } />) }
        </div>
    );
}
