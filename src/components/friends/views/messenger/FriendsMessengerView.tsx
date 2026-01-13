import { FollowFriendMessageComposer, ILinkEventTracker } from "@nitrots/nitro-renderer"
import { FC, KeyboardEvent, useEffect, useRef, useState } from "react"
import { AddEventLinkTracker, GetSessionDataManager, GetUserProfile, LocalizeText, RemoveLinkEventTracker, ReportType, SendMessageComposer } from "../../../../api"
import { Button, LayoutAvatarImageView, LayoutBadgeImageView, NitroCardContentView, NitroCardHeaderView, NitroCardView } from "../../../../common"
import { LayoutTimesView } from "../../../../common/layout/LayoutTimesView"
import { useHelp, useMessenger } from "../../../../hooks"
import { FriendsMessengerThreadView } from "./messenger-thread/FriendsMessengerThreadView"

export const FriendsMessengerView: FC<{}> = props =>
{
    const [ isVisible, setIsVisible ] = useState(false)
    const [ lastThreadId, setLastThreadId ] = useState(-1)
    const [ messageText, setMessageText ] = useState("")
    const { visibleThreads = [], activeThread = null, getMessageThread = null, sendMessage = null, setActiveThreadId = null, closeThread = null } = useMessenger()
    const { report = null } = useHelp()
    const messagesBox = useRef<HTMLDivElement>()

    const followFriend = () => (activeThread && activeThread.participant && SendMessageComposer(new FollowFriendMessageComposer(activeThread.participant.id)))
    const openProfile = () => (activeThread && activeThread.participant && GetUserProfile(activeThread.participant.id))

    const send = () =>
    {
        if(!activeThread || !messageText.length) return

        sendMessage(activeThread, GetSessionDataManager().userId, messageText)

        setMessageText("")
    }

    const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) =>
    {
        if(event.key !== "Enter") return

        send()
    }

    useEffect(() =>
    {
        const linkTracker: ILinkEventTracker = {
            linkReceived: (url: string) =>
            {
                const parts = url.split("/")

                if(parts.length === 2)
                {
                    if(parts[1] === "open")
                    {
                        setIsVisible(true)

                        return
                    }

                    if(parts[1] === "toggle")
                    {
                        setIsVisible(prevValue => !prevValue)

                        return
                    }

                    const thread = getMessageThread(parseInt(parts[1]))

                    if(!thread) return

                    setActiveThreadId(thread.threadId)
                    setIsVisible(true)
                }
            },
            eventUrlPrefix: "friends-messenger/"
        }

        AddEventLinkTracker(linkTracker)

        return () => RemoveLinkEventTracker(linkTracker)
    }, [ getMessageThread, setActiveThreadId ])

    useEffect(() =>
    {
        if(!isVisible || !activeThread) return

        messagesBox.current.scrollTop = messagesBox.current.scrollHeight
    }, [ isVisible, activeThread ])

    useEffect(() =>
    {
        if(isVisible && !activeThread)
        {
            if(lastThreadId > 0)
            {
                setActiveThreadId(lastThreadId)
            }
            else
            {
                if(visibleThreads.length > 0) setActiveThreadId(visibleThreads[0].threadId)
            }

            return
        }

        if(!isVisible && activeThread)
        {
            setLastThreadId(activeThread.threadId)
            setActiveThreadId(-1)
        }
    }, [ isVisible, activeThread, lastThreadId, visibleThreads, setActiveThreadId ])

    useEffect(() => {
        if(visibleThreads.length === 0) {
            setIsVisible(false)
        }
    }, [ visibleThreads ])

    if(!isVisible) return null

    return (
        <NitroCardView uniqueKey="messenger" className="illumina-messenger w-[282px]">
            <NitroCardHeaderView headerText={ LocalizeText("messenger.window.title", [ "OPEN_CHAT_COUNT" ], [ visibleThreads.length.toString() ]) } onCloseClick={ event => setIsVisible(false) } isClose={ false } />
            <NitroCardContentView>
                <div className="flex flex-col">
                    <div className="flex items-center">
                        { visibleThreads && (visibleThreads.length > 0) && visibleThreads.map(thread => (
                            <div key={ thread.threadId } className={`size-[35px] overflow-hidden ${activeThread === thread ? "illumina-previewer" : ""}`} onClick={ event => setActiveThreadId(thread.threadId) }>
                                <div className="relative flex !size-[35px] h-full cursor-pointer items-center justify-center overflow-hidden">
                                    { thread.unread &&
                                        <i className="absolute right-[3px] top-[7px] z-[1] h-[11px] w-[13px] bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-255px_-70px]" /> }
                                    { (thread.participant.id > 0) &&
                                        <LayoutAvatarImageView className="!size-[70px] shrink-0 !bg-[center_-18px] drop-shadow-[0px_1px_0_#fff] [image-rendering:initial] dark:drop-shadow-[0px_1px_0_#33312B]" figure={ thread.participant.figure } headOnly={ true } direction={ 2 } scale={ 0.50 } /> }
                                    { (thread.participant.id <= 0) &&
                                        <LayoutBadgeImageView className="!size-8 bg-center bg-no-repeat [image-rendering:initial]" badgeCode={ thread.participant.figure } scale={ 0.6 } /> }
                                </div>
                            </div>
                        ))}
                    </div>
                    { activeThread &&
                        <div className="mt-2">
                            <div className="mb-1.5 flex items-center gap-1.5">
                                <p className="text-[11px] font-semibold !leading-3 text-[#4a4a4a] [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">{ LocalizeText("messenger.window.separator", [ "FRIEND_NAME" ], [ activeThread.participant.name ]) }</p>
                                <div className="h-0.5 grow border-b border-white bg-[#CCCCCC] dark:border-[#36322C] dark:bg-black" />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex gap-1">
                                    <Button className="!h-5 !px-1.5" onClick={ followFriend }>
                                        <i className="block h-2.5 w-[9px] bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-453px_0px]" />
                                    </Button>
                                    <Button className="!h-5 !px-[7px]" onClick={ openProfile }>
                                        <i className="block h-3 w-4 bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-436px_0px]" />
                                    </Button>
                                    <Button className="!h-5 !px-[15px]" onClick={ () => report(ReportType.IM, { reportedUserId: activeThread.threadId }) }>
                                        <p className="text-[11px] font-semibold !leading-3 text-[#040404] [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">{ LocalizeText("messenger.window.button.report") }</p>
                                    </Button>
                                </div>
                                <LayoutTimesView onClick={ event => {
                                    closeThread(activeThread.threadId)
                                    const lastVisibleThread = visibleThreads[visibleThreads.length - 1]
                                    setActiveThreadId(lastVisibleThread.threadId)
                                } } />
                            </div>
                            <div ref={ messagesBox } className="illumina-scrollbar mb-[9px] mt-[7px] h-[212px]">
                                <FriendsMessengerThreadView thread={ activeThread } />
                            </div>
                            <div className="illumina-input relative flex h-7 items-center px-px">
                                <input type="text" className="w-full pl-[9px] pr-[70px] text-xs text-[#010101]" maxLength={ 255 } placeholder={ LocalizeText("messenger.window.input.default", [ "FRIEND_NAME" ], [ activeThread.participant.name ]) } value={ messageText } onChange={ event => setMessageText(event.target.value) } onKeyDown={ onKeyDown } />
                                <Button className="absolute right-1 !h-5" onClick={ send }>
                                    <p className="text-[10px] font-semibold !leading-3 text-[#040404] [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">{ LocalizeText("widgets.chatinput.say") }</p>
                                </Button>
                            </div>
                        </div> }
                </div>
            </NitroCardContentView>
        </NitroCardView>
    )
}
