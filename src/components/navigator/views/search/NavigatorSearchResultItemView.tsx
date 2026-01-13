import { RoomDataParser } from "@nitrots/nitro-renderer"
import { FC, MouseEvent } from "react"
import { CreateRoomSession, DoorStateType, GetSessionDataManager, TryVisitRoom } from "../../../../api"
import { LayoutBadgeImageView, LayoutGridItemProps, LayoutRoomThumbnailView } from "../../../../common"
import { useNavigator } from "../../../../hooks"
import { NavigatorSearchResultItemInfoView } from "./NavigatorSearchResultItemInfoView"

export interface NavigatorSearchResultItemViewProps extends LayoutGridItemProps {
    roomData: RoomDataParser
    thumbnail?: boolean
}

export const NavigatorSearchResultItemView: FC<NavigatorSearchResultItemViewProps> = props => {
    const { roomData = null, children = null, thumbnail = false, ...rest } = props
    const { setDoorData = null } = useNavigator()

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

    const visitRoom = (event: MouseEvent) => {
        if (roomData.ownerId !== GetSessionDataManager().userId) {
            if (roomData.habboGroupId !== 0) {
                TryVisitRoom(roomData.roomId)

                return
            }

            switch (roomData.doorMode) {
            case RoomDataParser.DOORBELL_STATE:
                setDoorData(prevValue => {
                    const newValue = { ...prevValue }

                    newValue.roomInfo = roomData
                    newValue.state = DoorStateType.START_DOORBELL

                    return newValue
                })
                return
            case RoomDataParser.PASSWORD_STATE:
                setDoorData(prevValue => {
                    const newValue = { ...prevValue }

                    newValue.roomInfo = roomData
                    newValue.state = DoorStateType.START_PASSWORD

                    return newValue
                })
                return
            }
        }

        CreateRoomSession(roomData.roomId)
    }

    if (thumbnail) return (
        <div onClick={visitRoom} className="illumina-navigator-room max-h-[153px] cursor-pointer overflow-hidden p-[7px]" {...rest}>
            <LayoutRoomThumbnailView roomId={roomData.roomId} customUrl={roomData.officialRoomPicRef} className="relative mb-1 flex flex-col items-center justify-end" isRoom={true}>
                {roomData.habboGroupId > 0 && <LayoutBadgeImageView badgeCode={roomData.groupBadgeCode} isGroup={true} className={"absolute left-0 top-0 m-1"} />}
                <div className="absolute bottom-[3px] left-8 h-[18px] w-10 bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')]" style={{ backgroundPosition: getUserCounterColor() }}>
                    <p className="absolute left-[26px] top-0.5 text-xs font-semibold text-white">{roomData.userCount}</p>
                </div>
                {(roomData.doorMode !== RoomDataParser.OPEN_STATE) && (
                    <i className="absolute bottom-0 right-0 mb-1 me-1 h-4 w-[13px] bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')]" style={{ backgroundPosition: (roomData.doorMode === RoomDataParser.DOORBELL_STATE ? "-260px 0px" : roomData.doorMode === RoomDataParser.PASSWORD_STATE ? "-274px 0px" : roomData.doorMode === RoomDataParser.INVISIBLE_STATE ? "-288px 0px" : "") }} />)}
            </LayoutRoomThumbnailView>
            <div className="flex w-full">
                <p className="w-4/5 overflow-hidden text-xs">{roomData.roomName}</p>
                <NavigatorSearchResultItemInfoView roomData={roomData} />
                {children}
            </div>
        </div>
    )

    return (
        <div onClick={visitRoom} className="navigator-item illumina-navigator-room-grid flex cursor-pointer items-center gap-1 px-2 py-1" {...rest}>
            <div className="relative h-[18px] w-10 shrink-0 bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')]" style={{ backgroundPosition: getUserCounterColor() }}>
                <p className="absolute left-[26px] top-0.5 text-xs font-semibold text-white">{roomData.userCount}</p>
            </div>
            <p className="w-full truncate text-xs">{roomData.roomName}</p>
            <div className="flex items-center gap-1">
                {(roomData.doorMode !== RoomDataParser.OPEN_STATE) && (
                    <i className="h-4 w-[13px] bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')]" style={{ backgroundPosition: (roomData.doorMode === RoomDataParser.DOORBELL_STATE ? "-260px 0px" : roomData.doorMode === RoomDataParser.PASSWORD_STATE ? "-274px 0px" : roomData.doorMode === RoomDataParser.INVISIBLE_STATE ? "-288px 0px" : "") }} />)}
                {roomData.habboGroupId > 0 && <i className="h-[11px] w-[13px] bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-321px_0px]" />}
                <NavigatorSearchResultItemInfoView roomData={roomData} />
            </div>
            {children}
        </div>
    )
}
