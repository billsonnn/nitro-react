import { GetRoomVisitsMessageComposer, RoomVisitsData, RoomVisitsEvent } from "@nitrots/nitro-renderer"
import { FC, useEffect, useState } from "react"
import { SendMessageComposer, TryVisitRoom } from "../../../../api"
import { DraggableWindowPosition, InfiniteScroll, NitroCardContentView, NitroCardHeaderView, NitroCardView } from "../../../../common"
import { useMessageEvent } from "../../../../hooks"

interface ModToolsUserRoomVisitsViewProps
{
    userId: number;
    userName: string;
    onCloseClick: () => void;
}

export const ModToolsUserRoomVisitsView: FC<ModToolsUserRoomVisitsViewProps> = props =>
{
    const { userId = null, userName = null, onCloseClick = null } = props
    const [ roomVisitData, setRoomVisitData ] = useState<RoomVisitsData>(null)

    useMessageEvent<RoomVisitsEvent>(RoomVisitsEvent, event =>
    {
        const parser = event.getParser()

        if(parser.data.userId !== userId) return

        setRoomVisitData(parser.data)
    })

    useEffect(() =>
    {
        SendMessageComposer(new GetRoomVisitsMessageComposer(userId))
    }, [ userId ])

    if(!userId) return null

    return (
        <NitroCardView uniqueKey="mod-tools-user-visits" className="illumina-mod-tools-user-visits" windowPosition={ DraggableWindowPosition.TOP_LEFT }>
            <NitroCardHeaderView headerText={`Room Visits: ${userName}`} onCloseClick={ onCloseClick } />
            <NitroCardContentView>
                <div className="illumina-scrollbar h-[190px] w-[280px]">
                    <InfiniteScroll className="w-full" rows={ roomVisitData?.rooms ?? [] } rowRender={ row => (
                        <div className="flex bg-white p-1 dark:bg-[#33312b]">
                            <p className="w-[185px] cursor-pointer truncate text-[13px] font-semibold !leading-3 underline [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">{ row.roomName }</p>
                            <div className="flex gap-1.5">
                                <p className="text-[13px] !leading-3">{ row.enterHour.toString().padStart(2, "0") }: { row.enterMinute.toString().padStart(2, "0") }</p>
                                <p className="cursor-pointer text-[13px] font-semibold !leading-3 underline [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]" onClick={ event => TryVisitRoom(row.roomId) }>Enter</p>
                            </div>
                        </div>
                    )} />
                </div>
            </NitroCardContentView>
        </NitroCardView>
    )
}
