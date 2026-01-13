import { ILinkEventTracker } from "@nitrots/nitro-renderer"
import { FC, useEffect, useMemo, useRef, useState } from "react"
import { AddEventLinkTracker, ChatEntryType, RemoveLinkEventTracker } from "../../api"
import { InfiniteScroll } from "../../common"
import { useChatHistory } from "../../hooks"

export const ChatHistoryView: FC<{}> = props =>
{
    const [ isVisible, setIsVisible ] = useState(false)
    const [ searchText, setSearchText ] = useState<string>("")
    const { chatHistory = [] } = useChatHistory()
    const elementRef = useRef<HTMLDivElement>(null)

    const filteredChatHistory = useMemo(() => 
    {
        if (searchText.length === 0) return chatHistory

        let text = searchText.toLowerCase()

        return chatHistory.filter(entry => ((entry.message && entry.message.toLowerCase().includes(text))) || (entry.name && entry.name.toLowerCase().includes(text)))
    }, [ chatHistory, searchText ])

    useEffect(() =>
    {
        if(elementRef && elementRef.current && isVisible) elementRef.current.scrollTop = elementRef.current.scrollHeight
    }, [ isVisible ])

    useEffect(() =>
    {
        const linkTracker: ILinkEventTracker = {
            linkReceived: (url: string) =>
            {
                const parts = url.split("/")
        
                if(parts.length < 2) return
        
                switch(parts[1])
                {
                case "show":
                    setIsVisible(true)
                    return
                case "hide":
                    setIsVisible(false)
                    return
                case "toggle":
                    setIsVisible(prevValue => !prevValue)
                    return
                }
            },
            eventUrlPrefix: "chat-history/"
        }

        AddEventLinkTracker(linkTracker)

        return () => RemoveLinkEventTracker(linkTracker)
    }, [])

    if(!isVisible) return null

    return (
        <div className="illumina-chat-history absolute left-0 top-0 z-0 h-[calc(100vh-51px)] w-[420px] bg-[#25211B]/75 pl-2.5">
            <InfiniteScroll className="illumina-scrollbar relative size-full pb-32 pt-2" rows={ filteredChatHistory } rowRender={ row => (
                <div className="flex items-center gap-2.5">
                    <p className="text-sm italic text-[#9A9C9C]">{ row.timestamp }</p>
                    { (row.type === ChatEntryType.TYPE_CHAT) &&
                        <div className="bubble-container relative w-fit select-none transition-[top] delay-0 duration-[0.2s] ease-[ease] [pointer-events:all]">
                            { (row.style === 0) && <div className="absolute -top-px left-px z-[1] h-[calc(100%_-_0.5px)] w-[30px] rounded-[7px] bg-[#c8c8c8]" style={ { backgroundColor: row.color } } /> }
                            <div className={ `chat-bubble relative z-[1] min-h-[26px] max-w-full text-sm [word-break:break-word] ${ "bubble-" + row.style } ${ "type-" + row.chatType }` }>
                                <div className="user-container z-[3] flex h-full max-h-6 items-center justify-center overflow-hidden">
                                    { row.imageUrl && (row.imageUrl.length > 0) && <div className="absolute left-[-9.25px] top-[-15px] h-[65px] w-[45px] scale-50 overflow-hidden bg-center bg-no-repeat [image-rendering:initial]" style={ { backgroundImage: `url(${ row.imageUrl })` } } /> }
                                </div>
                                <div className="chat-content ml-[27px] min-h-[25px] py-[5px] pl-1 pr-1.5 leading-none text-black">
                                    <b className="username text-sm !leading-3" dangerouslySetInnerHTML={ { __html: `${ row.name }: ` } } />
                                    <span className="message" dangerouslySetInnerHTML={ { __html: `${ row.message }` } } />
                                </div>
                            </div>
                        </div> }
                    { (row.type === ChatEntryType.TYPE_ROOM_INFO) &&
                        <div className="flex items-center gap-1.5">
                            <i className="block h-4 w-[17px] bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-426px_-84px]" />
                            <p className="my-2 break-words text-sm !text-[#FE0000]">{ row.name }</p>
                        </div> }
                </div>
            )} />
        </div>
    )
}
