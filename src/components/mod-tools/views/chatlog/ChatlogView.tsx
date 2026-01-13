import { ChatRecordData } from "@nitrots/nitro-renderer"
import { FC, useMemo } from "react"
import { CreateLinkEvent } from "../../../../api"
import { InfiniteScroll } from "../../../../common"
import { useModTools } from "../../../../hooks"
import { ChatlogRecord } from "./ChatlogRecord"

interface ChatlogViewProps
{
    records: ChatRecordData[];
}

export const ChatlogView: FC<ChatlogViewProps> = props =>
{
    const { records = null } = props
    const { openRoomInfo = null } = useModTools()

    const allRecords = useMemo(() =>
    {
        const results: ChatlogRecord[] = []

        records.forEach(record =>
        {
            results.push({
                isRoomInfo: true,
                roomId: record.roomId,
                roomName: record.roomName
            })

            record.chatlog.forEach(chatlog =>
            {
                results.push({
                    timestamp: chatlog.timestamp,
                    habboId: chatlog.userId,
                    username: chatlog.userName,
                    hasHighlighting: chatlog.hasHighlighting,
                    message: chatlog.message,
                    isRoomInfo: false
                })
            })
        })
        
        return results
    }, [ records ])

    const RoomInfo = (props: { roomId: number, roomName: string }) =>
    {
        return (
            <div className="my-1 mb-1.5 flex gap-1">
                <p className="text-[13px] !leading-3">Room name:</p>
                <p className="cursor-pointer text-[13px] font-semibold !leading-3 underline [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]" onClick={ event => CreateLinkEvent(`mod-tools/toggle-room-info/${ props.roomId }`) }>{ props.roomName }</p>
            </div>
        )
    }

    return (
        <>
            <div className="illumina-scrollbar h-[337px] w-[387px]">
                { (records && (records.length > 0)) &&
                    <InfiniteScroll className="w-full" rows={ allRecords } rowRender={ (row: ChatlogRecord) =>
                    {
                        return (
                            <>
                                { row.isRoomInfo &&
                                    <RoomInfo roomId={ row.roomId } roomName={ row.roomName } /> }
                                { !row.isRoomInfo &&
                                    <div className="flex bg-white p-1 dark:bg-[#33312b]">
                                        <div className="flex w-[150px] shrink-0 gap-1.5">
                                            <p className="text-[13px] !leading-3">{ row.timestamp }</p>
                                            <p className="cursor-pointer text-[13px] font-semibold !leading-3 underline [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]" onClick={ event => CreateLinkEvent(`mod-tools/open-user-info/${ row.habboId }`) }>{ row.username }</p>
                                        </div>
                                        <p className="break-words text-[13px] !leading-3">{ row.message }</p>
                                    </div> }
                            </>
                        )
                    } } /> }
            </div>
        </>
    )
}
