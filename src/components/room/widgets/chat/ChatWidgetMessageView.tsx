import { RoomChatSettings, RoomObjectCategory } from "@nitrots/nitro-renderer"
import { FC, useEffect, useMemo, useRef, useState } from "react"
import { ChatBubbleMessage, GetRoomEngine } from "../../../../api"

interface ChatWidgetMessageViewProps
{
    chat: ChatBubbleMessage;
    makeRoom: (chat: ChatBubbleMessage) => void;
    bubbleWidth?: number;
}

export const ChatWidgetMessageView: FC<ChatWidgetMessageViewProps> = props =>
{
    const { chat = null, makeRoom = null, bubbleWidth = RoomChatSettings.CHAT_BUBBLE_WIDTH_NORMAL } = props
    const [ isVisible, setIsVisible ] = useState(false)
    const [ isReady, setIsReady ] = useState<boolean>(false)
    const elementRef = useRef<HTMLDivElement>()

    const getBubbleWidth = useMemo(() =>
    {
        switch(bubbleWidth)
        {
        case RoomChatSettings.CHAT_BUBBLE_WIDTH_NORMAL:
            return 350
        case RoomChatSettings.CHAT_BUBBLE_WIDTH_THIN:
            return 240
        case RoomChatSettings.CHAT_BUBBLE_WIDTH_WIDE:
            return 2000
        }
    }, [ bubbleWidth ])

    useEffect(() =>
    {
        setIsVisible(false)
        
        const element = elementRef.current

        if(!element) return

        const width = element.offsetWidth
        const height = element.offsetHeight

        chat.width = width
        chat.height = height
        chat.elementRef = element
        
        let left = chat.left
        let top = chat.top

        if(!left && !top)
        {
            left = (chat.location.x - (width / 2))
            top = (element.parentElement.offsetHeight - height)
            
            chat.left = left
            chat.top = top
        }

        setIsReady(true)

        return () =>
        {
            chat.elementRef = null

            setIsReady(false)
        }
    }, [ chat ])

    useEffect(() =>
    {
        if(!isReady || !chat || isVisible) return
        
        if(makeRoom) makeRoom(chat)

        setIsVisible(true)
    }, [ chat, isReady, isVisible, makeRoom ])

    return (
        <div ref={ elementRef } className={ `bubble-container absolute w-fit select-none transition-[top] delay-0 duration-[0.2s] ease-[ease] [pointer-events:all] ${ isVisible ? "visible" : "invisible" }` } onClick={ event => GetRoomEngine().selectRoomObject(chat.roomId, chat.senderId, RoomObjectCategory.UNIT) }>
            { (chat.styleId === 0) && <div className="absolute -top-px left-px z-[1] h-[calc(100%_-_0.5px)] w-[30px] rounded-[7px] bg-[#c8c8c8]" style={ { backgroundColor: chat.color } } /> }
            <div className={ `chat-bubble bubble- relative z-[1] min-h-[26px] max-w-[350px] text-sm [word-break:break-word] ${ "bubble-" + chat.styleId } ${ "type-" + chat.type }` } style={ { maxWidth: getBubbleWidth } }>
                <div className="user-container z-[3] flex h-full max-h-6 items-center justify-center overflow-hidden">
                    { chat.imageUrl && (chat.imageUrl.length > 0) &&
                        <div className="absolute left-[-9.25px] top-[-15px] h-[65px] w-[45px] scale-50 overflow-hidden bg-center bg-no-repeat [image-rendering:initial]" style={ { backgroundImage: `url(${ chat.imageUrl })` } } /> }
                </div>
                <div className="chat-content ml-[27px] min-h-[25px] py-[5px] pl-1 pr-1.5 leading-none text-black">
                    <b className="username text-sm !leading-3" dangerouslySetInnerHTML={ { __html: `${ chat.username }: ` } } />
                    <span className="message" dangerouslySetInnerHTML={ { __html: `${ chat.formattedText }` } } />
                </div>
                <div className="absolute bottom-[-5px] left-2/4 h-1.5 w-[9px] -translate-x-2/4 cursor-pointer" />
            </div>
        </div>
    )
}
