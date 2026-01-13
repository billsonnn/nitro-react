import { RoomDataParser } from "@nitrots/nitro-renderer"
import { FC, MouseEvent, useMemo } from "react"
import { CreateRoomSession, GetConfiguration, GetSessionDataManager, LocalizeText, TryVisitRoom } from "../../../api"
import { Button, LayoutBadgeImageView, LayoutGridItemProps } from "../../../common"

export interface RoomsContainerResultItemViewProps extends LayoutGridItemProps {
    roomData: RoomDataParser
    thumbnail?: boolean
    onClose: () => void
}

export const RoomsContainerResultItemView: FC<RoomsContainerResultItemViewProps> = props => {
    const { roomData = null, children = null, thumbnail = false, onClose, ...rest } = props

    const visitRoom = (event: MouseEvent) => {
        if (roomData.ownerId !== GetSessionDataManager().userId) {
            if (roomData.habboGroupId !== 0) {
                TryVisitRoom(roomData.roomId)
                onClose()

                return
            }
        }

        CreateRoomSession(roomData.roomId)
        onClose()
    }

    const getImageUrl = useMemo(() => {
        return `${GetConfiguration<string>("thumbnails.url").replace("%thumbnail%", roomData.roomId.toString())}?cache=${Math.random()}`
    }, [ roomData.roomId ])

    return (
        <div className="flex h-full gap-3">
            <div className="relative flex size-[110px] shrink-0 flex-col items-center justify-end drop-shadow-[1px_1px_0_#fff] dark:drop-shadow-[1px_1px_0_#191512]">
                <div className="absolute left-0 top-0 size-full border border-[#CCCCCC] bg-[url('/client-assets/images/profile/default-thumbnail.png?v=2451779')] bg-cover dark:border-[#191512]" />
                <div className="absolute left-0 top-0 size-full border border-[#CCCCCC] bg-cover dark:border-[#191512]" style={{ backgroundImage: `url(${getImageUrl})` }} />
                {roomData.habboGroupId > 0 && <LayoutBadgeImageView badgeCode={roomData.groupBadgeCode} isGroup={true} className={"absolute left-0 top-0 m-1"} />}
            </div>
            <div className="flex max-w-40 flex-1 flex-col">
                <p className="line-clamp-2 w-full overflow-hidden break-words text-sm font-semibold [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">{roomData.roomName}</p>
                <div className="mt-1 flex items-center gap-1">
                    <i className="h-3 w-[11px] bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-360px_-103px]" />
                    <p className="mt-px text-[11px] text-[#3C3C3C] [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">{roomData.score}</p>
                </div>
                <p className="line-clamp-2 grow overflow-hidden break-words pt-3 text-xs text-[#3C3C3C] [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">{roomData.description}</p>
                <Button className="w-fit gap-1.5 !px-[13px]" onClick={visitRoom}>
                    <i className="h-[17px] w-3.5 bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-345px_-103px]" />
                    <p className="text-[10px] lowercase [text-shadow:_0_1px_0_#fff] first-letter:uppercase dark:[text-shadow:_0_1px_0_#33312B]">{LocalizeText("landing.view.checkitout.button")}</p>
                </Button>
                {children}
            </div>
        </div>
    )
}
