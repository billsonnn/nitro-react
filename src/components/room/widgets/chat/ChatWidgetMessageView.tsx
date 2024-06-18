import { GetRoomEngine, RoomChatSettings, RoomObjectCategory } from '@nitrots/nitro-renderer';
import { FC, useEffect, useMemo, useRef, useState } from 'react';
import { ChatBubbleMessage } from '../../../../api';

interface ChatWidgetMessageViewProps
{
    chat: ChatBubbleMessage;
    makeRoom: (chat: ChatBubbleMessage) => void;
    bubbleWidth?: number;
}

export const ChatWidgetMessageView: FC<ChatWidgetMessageViewProps> = ({
    chat = null,
    makeRoom = null,
    bubbleWidth = RoomChatSettings.CHAT_BUBBLE_WIDTH_NORMAL
}) =>
{
    const [ isVisible, setIsVisible ] = useState(false);
    const [ isReady, setIsReady ] = useState(false);
    const elementRef = useRef<HTMLDivElement>(null);

    const getBubbleWidth = useMemo(() =>
    {
        switch(bubbleWidth)
        {
            case RoomChatSettings.CHAT_BUBBLE_WIDTH_NORMAL:
                return 'w-350';
            case RoomChatSettings.CHAT_BUBBLE_WIDTH_THIN:
                return 'w-240';
            case RoomChatSettings.CHAT_BUBBLE_WIDTH_WIDE:
                return 'w-2000';
            default:
                return 'w-350';
        }
    }, [ bubbleWidth ]);

    useEffect(() =>
    {
        setIsVisible(false);

        const element = elementRef.current;
        if(!element) return;

        const { offsetWidth: width, offsetHeight: height } = element;

        chat.width = width;
        chat.height = height;
        chat.elementRef = element;

        let { left, top } = chat;

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
        };
    }, [ chat ]);

    useEffect(() =>
    {
        if(!isReady || !chat || isVisible) return;

        if(makeRoom) makeRoom(chat);
        setIsVisible(true);
    }, [ chat, isReady, isVisible, makeRoom ]);

    return (
        <div ref={ elementRef } className={ `bubble-container ${ isVisible ? 'visible' : 'invisible' } w-max absolute select-none pointer-events-auto` }
            onClick={ () => GetRoomEngine().selectRoomObject(chat.roomId, chat.senderId, RoomObjectCategory.UNIT) }>
            { chat.styleId === 0 && (
                <div className="absolute top-[-1px] left-[1px] w-[30px] h-[calc(100%-0.5px)] rounded-[7px] z-[1]" style={ { backgroundColor: chat.color } } />
            ) }
            <div className={ `chat-bubble bubble-${ chat.styleId } ${ getBubbleWidth } relative z-[1] break-words min-h-[26px] text-[14px] max-w-[350px]` }
                style={ { maxWidth: getBubbleWidth } }>
                <div className="user-container flex items-center justify-center h-full max-h-[24px] overflow-hidden">
                    { chat.imageUrl && chat.imageUrl.length > 0 && (
                        <div className="user-image absolute top-[-15px] left-[-9.25px] w-[45px] h-[65px] bg-no-repeat bg-center scale-50" style={ { backgroundImage: `url(${ chat.imageUrl })` } } />
                    ) }
                </div>
                <div className="chat-content py-[5px] px-[6px] ml-[27px] leading-[1] min-h-[25px]">
                    <b className="username" dangerouslySetInnerHTML={ { __html: `${ chat.username }: ` } } />
                    <span className="message" dangerouslySetInnerHTML={ { __html: `${ chat.formattedText }` } } />
                </div>
                <div className="pointer absolute left-[50%] translate-x-[-50%] w-[9px] h-[6px] bottom-[-5px]" />
            </div>
        </div>
    );
};
