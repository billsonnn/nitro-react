import { RoomChatSettings, RoomObjectCategory } from '@nitrots/nitro-renderer';
import { FC, useEffect, useMemo, useRef, useState } from 'react';
import { ChatBubbleMessage, GetRoomEngine } from '../../../../api';

interface ChatWidgetMessageViewProps
{
    chat: ChatBubbleMessage;
    makeRoom: (chat: ChatBubbleMessage) => void;
    onBubbleReady?: () => void;
    bubbleWidth?: number;
}

export const ChatWidgetMessageView: FC<ChatWidgetMessageViewProps> = props =>
{
    const { chat = null, makeRoom = null, onBubbleReady = null, bubbleWidth = RoomChatSettings.CHAT_BUBBLE_WIDTH_NORMAL } = props;
    const [ isVisible, setIsVisible ] = useState(false);
    const [ isReady, setIsReady ] = useState<boolean>(false);
    const elementRef = useRef<HTMLDivElement>();

    const getBubbleWidth = useMemo(() =>
    {
        switch(bubbleWidth)
        {
            case RoomChatSettings.CHAT_BUBBLE_WIDTH_NORMAL:
                return 350;
            case RoomChatSettings.CHAT_BUBBLE_WIDTH_THIN:
                return 240;
            case RoomChatSettings.CHAT_BUBBLE_WIDTH_WIDE:
                return 2000;
        }
    }, [ bubbleWidth ]);

    useEffect(() =>
    {
        setIsVisible(false);
        
        const element = elementRef.current;

        if(!element) return;

        const width = element.offsetWidth;
        const height = element.offsetHeight;

        chat.width = width;
        chat.height = height;
        chat.elementRef = element;
        
        let left = chat.left;
        let top = chat.top;

        if(!left && !top)
        {
            left = (chat.location.x - (width / 2));
            top = (element.parentElement.offsetHeight - height);
            
            chat.left = left;
            chat.top = top;
        }

        setIsReady(true);

        return () =>
        {
            chat.elementRef = null;

            setIsReady(false);
        }
    }, [ chat ]);

    useEffect(() =>
    {
        if(!isReady || !chat || isVisible) return;
        
        if(makeRoom) makeRoom(chat);

        if(onBubbleReady) onBubbleReady();

        setIsVisible(true);
    }, [ chat, isReady, isVisible, makeRoom, onBubbleReady ]);

    return (
        <div ref={ elementRef } className={ `bubble-container ${ isVisible ? 'visible' : 'invisible' }` } onClick={ event => GetRoomEngine().selectRoomObject(chat.roomId, chat.senderId, RoomObjectCategory.UNIT) }>
            { (chat.styleId === 0) &&
                <div className="user-container-bg" style={ { backgroundColor: chat.color } } /> }
            <div className={ `chat-bubble bubble-${ chat.styleId } type-${ chat.type }` } style={ { maxWidth: getBubbleWidth } }>
                <div className="user-container">
                    { chat.imageUrl && (chat.imageUrl.length > 0) &&
                        <div className="user-image" style={ { backgroundImage: `url(${ chat.imageUrl })` } } /> }
                </div>
                <div className="chat-content">
                    <b className="username mr-1" dangerouslySetInnerHTML={ { __html: `${ chat.username }: ` } } />
                    <span className="message" dangerouslySetInnerHTML={ { __html: `${ chat.formattedText }` } } />
                </div>
                <div className="pointer" />
            </div>
        </div>
    );
}
