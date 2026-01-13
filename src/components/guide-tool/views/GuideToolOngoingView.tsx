import { GuideSessionGetRequesterRoomMessageComposer, GuideSessionInviteRequesterMessageComposer, GuideSessionMessageMessageComposer, GuideSessionRequesterRoomMessageEvent, GuideSessionResolvedMessageComposer } from "@nitrots/nitro-renderer"
import { FC, KeyboardEvent, useCallback, useEffect, useRef, useState } from "react"
import { GetSessionDataManager, GuideToolMessageGroup, LocalizeText, SendMessageComposer, TryVisitRoom } from "../../../api"
import { Button, LayoutAvatarImageView } from "../../../common"
import { useMessageEvent } from "../../../hooks"

interface GuideToolOngoingViewProps
{
    isGuide: boolean;
    userId: number;
    userName: string;
    userFigure: string;
    isTyping: boolean;
    messageGroups: GuideToolMessageGroup[];
}

export const GuideToolOngoingView: FC<GuideToolOngoingViewProps> = props =>
{
    const scrollDiv = useRef<HTMLDivElement>(null)

    const { isGuide = false, userId = 0, userName = null, userFigure = null, isTyping = false, messageGroups = [] } = props

    const [ messageText, setMessageText ] = useState<string>("")

    useEffect(() =>
    {
        scrollDiv.current?.scrollIntoView({ block: "end", behavior: "smooth" })

    }, [ messageGroups ])

    const visit = useCallback(() =>
    {
        SendMessageComposer(new GuideSessionGetRequesterRoomMessageComposer())
    }, [])

    const invite = useCallback(() =>
    {
        SendMessageComposer(new GuideSessionInviteRequesterMessageComposer())
    }, [])

    const resolve = useCallback(() =>
    {
        SendMessageComposer(new GuideSessionResolvedMessageComposer())
    }, [])

    useMessageEvent<GuideSessionRequesterRoomMessageEvent>(GuideSessionRequesterRoomMessageEvent, event =>
    {
        const parser = event.getParser()

        TryVisitRoom(parser.requesterRoomId)
    })

    const sendMessage = useCallback(() =>
    {
        if(!messageText || !messageText.length) return

        SendMessageComposer(new GuideSessionMessageMessageComposer(messageText))
        setMessageText("")
    }, [ messageText ])

    const onKeyDown = useCallback((event: KeyboardEvent<HTMLInputElement>) =>
    {
        if(event.key !== "Enter") return

        sendMessage()
    }, [ sendMessage ])

    const isOwnChat = useCallback((userId: number) =>
    {
        return userId === GetSessionDataManager().userId
    }, [])

    return (
        <>
            {!isGuide && <div className="mb-0.5 h-0.5 w-full border-b border-white bg-[#CCCCCC] dark:border-[#36322C] dark:bg-black" /> }
            <div className={`flex items-center justify-between p-2 ${!isGuide ? "bg-white dark:bg-[#33312b]" : ""}`}>
                { isGuide &&
                    <div className="flex gap-1">
                        <Button onClick={ visit }>{ LocalizeText("guide.help.request.guide.ongoing.visit.button") }</Button>
                        <Button onClick={ invite }>{ LocalizeText("guide.help.request.guide.ongoing.invite.button") }</Button>
                    </div> }
                { !isGuide &&
                    <div className="flex gap-2">
                        <i className="block h-[30px] w-8 bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-271px_-252px]" />
                        <div>
                            <p className="text-[13px] font-semibold [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">{ userName }</p>
                            <p className="text-[13px] text-[#666666]">{ LocalizeText("guide.help.request.user.ongoing.guide.desc") }</p>
                        </div>
                    </div> }
                <Button variant="underline" className="!text-[#727272]">{ LocalizeText("guide.help.common.report.link") }</Button>
            </div>
            <div className="mt-1.5 h-0.5 w-full border-b border-white bg-[#CCCCCC] dark:border-[#36322C] dark:bg-black" />
            <div className="illumina-scrollbar h-[212px] pt-4">
                { messageGroups.map((group, index) => (
                    <div key={ index } className={`mb-4 ml-2.5 flex gap-[9px] ${isOwnChat(group.userId) ? "justify-end" : "justify-start"}`}>
                        { (isOwnChat(group.userId)) && <LayoutAvatarImageView className="!h-[50px] !w-10 shrink-0 !bg-[center_-30px]" figure={ GetSessionDataManager().figure } direction={ 2 } /> }
                        <div className="w-full">
                            <p className="mb-1 text-xs font-semibold !leading-3 text-[#565656] [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">
                                { (isOwnChat(group.userId)) && GetSessionDataManager().userName }
                                { (!isOwnChat(group.userId)) && userName }
                            </p>
                            <div key={ index } className={`illumina-messenger-message relative min-h-[30px] w-[204px] px-3 py-2.5 ${isOwnChat(group.userId) ? "message-left" : "message-right"}`}>
                                { group.messages.map((chat, index) => (
                                    <p key={ index } className={`break-words text-xs text-[#040404] ${chat.roomId ? "cursor-pointer underline" : ""}`} onClick={ () => chat.roomId ? TryVisitRoom(chat.roomId) : null }>
                                        { chat.message }
                                    </p>
                                ))}
                            </div>
                        </div>
                        { (!isOwnChat(group.userId)) && <LayoutAvatarImageView className="!h-[50px] !w-10 shrink-0 !bg-[center_-30px]" figure={ userFigure } direction={ 4 } /> }
                    </div>
                ))}
                <div ref={ scrollDiv } />
            </div>
            <div className="mb-3.5 h-0.5 w-full border-b border-white bg-[#CCCCCC] dark:border-[#36322C] dark:bg-black" />
            <div className="illumina-input relative mx-[9px] flex h-7 items-center px-px">
                <input type="text" className="w-full pl-[9px] pr-[70px] text-xs text-[#010101]" placeholder={ LocalizeText("guide.help.request.guide.ongoing.input.empty", [ "name" ], [ userName ]) } value={ messageText } onChange={ event => setMessageText(event.target.value) } onKeyDown={ onKeyDown } />
                <Button className="absolute right-1 !h-5" onClick={ sendMessage }>
                    { LocalizeText("widgets.chatinput.say") }
                </Button>
            </div>
            <Button variant="underline" onClick={ resolve }>
                { LocalizeText("guide.help.request." + (isGuide ? "guide" : "user") + ".ongoing.close.link") }
            </Button>
        </>
    )
}
