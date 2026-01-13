import { GetGuestRoomResultEvent, NavigatorSearchComposer, RateFlatMessageComposer } from "@nitrots/nitro-renderer"
import { FC, useState } from "react"
import { CreateLinkEvent, GetRoomEngine, LocalizeText, SendMessageComposer } from "../../../../api"
import { useMessageEvent, useNavigator, useRoom } from "../../../../hooks"

export const RoomToolsWidgetView: FC<{}> = props =>
{
    const [ isToolsExpand, setIsToolsExpand ] = useState<boolean>(true)
    const [ isZoomedIn, setIsZoomedIn ] = useState<boolean>(false)
    const [ roomName, setRoomName ] = useState<string>(null)
    const [ roomOwner, setRoomOwner ] = useState<string>(null)
    const [ roomTags, setRoomTags ] = useState<string[]>(null)
    const { navigatorData = null } = useNavigator()
    const { roomSession = null } = useRoom()
    
    const handleToolClick = (action: string, value?: string) =>
    {
        switch(action)
        {
        case "settings":
            CreateLinkEvent("navigator/toggle-room-info")
            return
        case "zoom":
            setIsZoomedIn(prevValue =>
            {
                let scale = GetRoomEngine().getRoomInstanceRenderingCanvasScale(roomSession.roomId, 1)

                if(!prevValue) scale /= 2
                else scale *= 2

                GetRoomEngine().setRoomInstanceRenderingCanvasScale(roomSession.roomId, 1, scale)

                return !prevValue
            })
            return
        case "chat_history":
            CreateLinkEvent("chat-history/toggle")
            return
        case "like_room":
            SendMessageComposer(new RateFlatMessageComposer(1))
            return
        case "toggle_room_link":
            CreateLinkEvent("navigator/toggle-room-link")
            return
        case "navigator_search_tag":
            CreateLinkEvent(`navigator/search/${ value }`)
            SendMessageComposer(new NavigatorSearchComposer("hotel_view", `tag:${ value }`))
            return
        }
    }

    useMessageEvent<GetGuestRoomResultEvent>(GetGuestRoomResultEvent, event =>
    {
        const parser = event.getParser()

        if(!parser.roomEnter || (parser.data.roomId !== roomSession.roomId)) return

        if(roomName !== parser.data.roomName) setRoomName(parser.data.roomName)
        if(roomOwner !== parser.data.ownerName) setRoomOwner(parser.data.ownerName)
        if(roomTags !== parser.data.tags) setRoomTags(parser.data.tags)
    })

    return (
        <div className="absolute bottom-20 left-0 z-10">
            <div className={`illumina-room-tools relative flex h-[98px] flex-col overflow-hidden py-2 pl-7 pr-2.5 text-white ${isToolsExpand ? "w-auto" : "w-[15px] !p-0"}`}>
                <div className="absolute left-0 top-0 flex h-[98px] w-[15px] cursor-pointer items-center justify-center bg-[url('/client-assets/images/room-tools/icon-bg.png?v=2451779')]" onClick={ () => setIsToolsExpand(!isToolsExpand) }>
                    { isToolsExpand
                        ? <i className="h-2 w-1.5 bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-354px_-172px]" />
                        : <i className="h-2 w-1.5 bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-361px_-172px]" /> }
                </div>
                { isToolsExpand &&
                    <>
                        <p className="mb-2 font-semibold !leading-3 [text-shadow:_0_-1px_0_#000]">{ roomName }</p>
                        { roomOwner?.length > 0
                            ? <p className="text-sm !leading-3 opacity-70">{ LocalizeText("room.tool.room.owner.prefix") } {roomOwner}</p>
                            : <p className="text-sm !leading-3 opacity-70">{ LocalizeText("navigator.navibutton.11") }</p> }
                        <div className="mt-6 flex gap-1.5">
                            <div className="illumina-purse flex size-7 cursor-pointer items-center justify-center" onClick={ () => handleToolClick("settings") }>
                                <i className="h-[15px] w-3.5 bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-391px_-160px]" />
                            </div>
                            <div className="illumina-purse flex size-7 cursor-pointer items-center justify-center" onClick={ () => handleToolClick("zoom") }>
                                <i className="h-5 w-3 bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-442px_-125px]" />
                            </div>
                            <div className="illumina-purse flex size-7 cursor-pointer items-center justify-center" onClick={ () => handleToolClick("chat_history") }>
                                <i className="h-[21px] w-[17px] bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-406px_-160px]" />
                            </div>
                            <div className={`illumina-purse flex size-7 cursor-pointer items-center justify-center ${!navigatorData.canRate ? "opacity-50" : ""}`} onClick={ () => handleToolClick("like_room") }>
                                <i className="h-[15px] w-3 bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-415px_-144px]" />
                            </div>
                        </div>
                    </> }
            </div>
        </div>
    )
}
