import { RoomDataParser } from "@nitrots/nitro-renderer"
import { FC, useRef, useState } from "react"
import { Overlay, Popover } from "react-bootstrap"
import { GetUserProfile } from "../../../../api"
import { LayoutBadgeImageView, LayoutRoomThumbnailView } from "../../../../common"

interface NavigatorSearchResultItemInfoViewProps {
    roomData: RoomDataParser;
}

export const NavigatorSearchResultItemInfoView: FC<NavigatorSearchResultItemInfoViewProps> = props => {
    const { roomData = null } = props
    const [ isVisible, setIsVisible ] = useState(false)
    const elementRef = useRef<HTMLDivElement>()

    const isDarkMode = localStorage.getItem("isDarkMode") === "true"

    const getUserCounterColor = () => {
        const num: number = (100 * (roomData.userCount / roomData.maxUserCount))

        let bg = "-105px -23px"

        if (num >= 92) {
            bg = "-228px -23px"
        }
        else if (num >= 50) {
            bg = "-187px -23px"
        }
        else if (num > 0) {
            bg = "-146px -23px"
        }

        return bg
    }

    return (
        <>
            <i ref={elementRef} className="block size-[18px] bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-241px_0px]" onMouseOver={event => setIsVisible(true)} onMouseLeave={event => setIsVisible(false)} />
            <Overlay show={isVisible} target={elementRef.current} placement="right">
                <Popover className={`z-[9999] ${isDarkMode ? "dark" : "light"}`}>
                    <div className="illumina-popover pixelated w-[300px] bg-transparent p-1.5">
                        <div className="flex w-full gap-3">
                            <LayoutRoomThumbnailView roomId={roomData.roomId} customUrl={roomData.officialRoomPicRef} className="flex flex-col items-center justify-end">
                                {roomData.habboGroupId > 0 && (
                                    <LayoutBadgeImageView badgeCode={roomData.groupBadgeCode} isGroup={true} className={"absolute left-0 top-0 m-1"} />)}
                                {roomData.doorMode !== RoomDataParser.OPEN_STATE && (
                                    <i className="absolute bottom-0 right-0 mb-1 me-1 h-4 w-[13px] bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')]" style={{ backgroundPosition: (roomData.doorMode === RoomDataParser.DOORBELL_STATE ? "-260px 0px" : roomData.doorMode === RoomDataParser.PASSWORD_STATE ? "-274px 0px" : roomData.doorMode === RoomDataParser.INVISIBLE_STATE ? "-288px 0px" : "") }} />)}
                            </LayoutRoomThumbnailView>
                            <div className="flex w-full max-w-[170px] flex-col justify-between overflow-hidden">
                                <div className="mb-2">
                                    <p className="mb-[3px] inline-block break-words text-xs font-semibold [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">
                                        {roomData.roomName}
                                    </p>
                                    {roomData.ownerName.length > 0 &&
                                        <div className="mb-[3px] flex items-center gap-0.5" onClick={event => GetUserProfile(roomData.ownerId)}>
                                            <i className="mt-px block h-3 w-4 bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-436px_0px]" />
                                            <p className="text-xs">{roomData.ownerName}</p>
                                        </div>
                                    }
                                    <p className="line-clamp-3 break-words text-xs">
                                        {roomData.description}
                                    </p>
                                </div>
                                <div className="relative shrink-0 bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] h-[18px] w-10" style={{ backgroundPosition: getUserCounterColor() }}>
                                    <p className="absolute left-[26px] top-0.5 text-xs font-semibold text-white">{roomData.userCount}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </Popover>
            </Overlay>
        </>
    )
}
