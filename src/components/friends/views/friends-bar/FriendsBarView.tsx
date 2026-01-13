import { FindNewFriendsMessageComposer } from "@nitrots/nitro-renderer"
import { FC, useEffect, useRef, useState } from "react"
import { LocalizeText, MessengerFriend, SendMessageComposer } from "../../../../api"
import { Button } from "../../../../common"
import { FriendBarItemView } from "./FriendBarItemView"

export const FriendBarView: FC<{ onlineFriends: MessengerFriend[] }> = props => {
    const { onlineFriends = null } = props
    const [ indexOffset, setIndexOffset ] = useState(0)
    const elementRef = useRef<HTMLDivElement | null>(null)
    const [ containerWidth, setContainerWidth ] = useState(1)
    const [ maxDisplayCount, setMaxDisplayCount ] = useState(1)
    const itemWidth = 128

    useEffect(() => {
        function handleResize() {
            const width = elementRef.current?.getBoundingClientRect().width
            setContainerWidth(width)
            const calculatedMaxDisplayCount = Math.floor(containerWidth / itemWidth)
            setMaxDisplayCount(calculatedMaxDisplayCount)
        }

        handleResize()

        window.addEventListener("resize", handleResize)

        return () => {
            window.removeEventListener("resize", handleResize)
        }
    }, [ containerWidth, maxDisplayCount, itemWidth, onlineFriends ])

    if (onlineFriends && onlineFriends.length > 0) return (
        <div className="flex size-full items-center">
            <button className="pr-1.5 disabled:opacity-50" disabled={indexOffset <= 0} onClick={() => setIndexOffset(indexOffset - 1)}>
                <i className="block h-7 w-[27px] bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-28px_-114px]" />
            </button>
            <div ref={ elementRef } className="flex size-full items-end">
                {onlineFriends && onlineFriends.length > 0 && onlineFriends.slice(indexOffset, indexOffset + maxDisplayCount).map((friend, i) => <FriendBarItemView key={i} friend={friend} />)}
            </div>
            <button className="pl-1.5 disabled:opacity-50" disabled={!((onlineFriends.length > maxDisplayCount) && (indexOffset + maxDisplayCount) <= onlineFriends.length - 1)} onClick={() => setIndexOffset(indexOffset + 1)}>
                <i className="block h-7 w-[27px] bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[0px_-114px]" />
            </button>
        </div>
    )

    return (
        <div className="flex size-full items-center">
            <p className="mr-4 text-[13px] font-semibold !text-[#565454] ![text-shadow:_0_1px_0_#33312B]">{ LocalizeText("nitro.toolbar.offline_friends.text") }</p>
            <Button variant="dark" className="!h-[34px] gap-1.5 !text-[13px]" onClick={ () => SendMessageComposer(new FindNewFriendsMessageComposer()) }>
                <i className="h-[18px] w-[15px] bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-67px_-118px]" />
                { LocalizeText("nitro.toolbar.offline_friends.button") }
            </Button>
        </div>
    )
}
