import { MouseEventType } from "@nitrots/nitro-renderer"
import { FC, useEffect, useRef, useState } from "react"
import { GetUserProfile, MessengerFriend, OpenMessengerChat } from "../../../../api"
import { LayoutAvatarImageView, LayoutBadgeImageView } from "../../../../common"
import { useFriends, useMessenger } from "../../../../hooks"

export const FriendBarItemView: FC<{ friend: MessengerFriend }> = props =>
{
    const { friend = null } = props
    const [ isVisible, setVisible ] = useState(false)
    const { followFriend = null } = useFriends()
    const elementRef = useRef<HTMLDivElement>()

    useEffect(() =>
    {
        const onClick = (event: MouseEvent) =>
        {
            const element = elementRef.current

            if(!element) return

            if((event.target !== element) && !element.contains((event.target as Node)))
            {
                setVisible(false)
            }
        }

        document.addEventListener(MouseEventType.MOUSE_CLICK, onClick)

        return () => document.removeEventListener(MouseEventType.MOUSE_CLICK, onClick)
    }, [])

    if(!friend)
    {
        return (
            <></>
        )
    }

    const { messageThreads } = useMessenger()

    const friendInfoArray = messageThreads.map((thread) => {
        return {
            id: thread.participant.id,
            name: thread.participant.name,
            unread: thread.unread
        }
    })

    const isUnread = friendInfoArray.some((info) => info.id === friend.id && info.unread)

    return (
        <div ref={ elementRef } className={`friend-bar-item relative flex h-12 w-32 cursor-pointer items-center ${isVisible ? "friend-bar-item-active" : ""}`} onClick={ event => setVisible(prevValue => !prevValue) }>
            <div className="friend-bar-item-container flex size-full">
                <div className="flex w-full">
                    { isUnread && <i className="absolute left-[55px] top-[-6px] block h-[19px] w-[23px] bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-255px_-49px]" />}
                    { (friend.id > 0)
                        ? <LayoutAvatarImageView figure={ friend.figure } direction={ 2 } className="!absolute !-left-5 !top-0 !h-[100px] !w-[90px] !bg-[center_-33px]" />
                        : <LayoutBadgeImageView className="!absolute !left-[5px] !top-2.5 size-10 shrink-0" badgeCode={ friend.figure } /> }
                    <div className="flex w-full flex-col overflow-hidden pl-[50px] pr-1.5">
                        <p className="mb-[3px] pt-[18px] text-[13px] text-white">{ friend.name }</p>
                        {isVisible && <div className="flex justify-between">
                            <i className="size-[21px] cursor-pointer bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-393px_0px] drop-shadow-[1px_1px_0_#46423E] hover:-translate-x-px hover:-translate-y-px hover:drop-shadow-[2px_2px_0_#46423E] active:translate-x-0 active:translate-y-0 active:brightness-90 active:drop-shadow-[1px_1px_0_#46423E]" onClick={ event => OpenMessengerChat(friend.id) } />
                            { friend.followingAllowed && <i className="size-[21px] cursor-pointer bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-371px_0px] drop-shadow-[1px_1px_0_#46423E] hover:-translate-x-px hover:-translate-y-px hover:drop-shadow-[2px_2px_0_#46423E] active:translate-x-0 active:translate-y-0 active:brightness-90 active:drop-shadow-[1px_1px_0_#46423E]" onClick={ event => followFriend(friend) } /> }
                            <i className="size-[21px] cursor-pointer bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-414px_0px] drop-shadow-[1px_1px_0_#46423E] hover:-translate-x-px hover:-translate-y-px hover:drop-shadow-[2px_2px_0_#46423E] active:translate-x-0 active:translate-y-0 active:brightness-90 active:drop-shadow-[1px_1px_0_#46423E]" onClick={ event => GetUserProfile(friend.id) } />
                        </div> }
                    </div>
                </div>
            </div>
        </div>
    )
}
