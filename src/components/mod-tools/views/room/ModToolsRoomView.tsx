import { GetCustomRoomFilterMessageComposer, GetModeratorRoomInfoMessageComposer, ModerateRoomMessageComposer, ModeratorActionMessageComposer, ModeratorRoomInfoEvent } from "@nitrots/nitro-renderer"
import { FC, useEffect, useState } from "react"
import { CreateLinkEvent, SendMessageComposer, TryVisitRoom } from "../../../../api"
import { Button, DraggableWindowPosition, NitroCardContentView, NitroCardHeaderView, NitroCardView } from "../../../../common"
import { useMessageEvent } from "../../../../hooks"

interface ModToolsRoomViewProps
{
    roomId: number;
    onCloseClick: () => void;
}

export const ModToolsRoomView: FC<ModToolsRoomViewProps> = props =>
{
    const { roomId = null, onCloseClick = null } = props
    const [ infoRequested, setInfoRequested ] = useState(false)
    const [ loadedRoomId, setLoadedRoomId ] = useState(null)
    const [ name, setName ] = useState(null)
    const [ ownerId, setOwnerId ] = useState(null)
    const [ ownerName, setOwnerName ] = useState(null)
    const [ ownerInRoom, setOwnerInRoom ] = useState(false)
    const [ usersInRoom, setUsersInRoom ] = useState(0)
    const [ kickUsers, setKickUsers ] = useState(false)
    const [ lockRoom, setLockRoom ] = useState(false)
    const [ changeRoomName, setChangeRoomName ] = useState(false)
    const [ message, setMessage ] = useState("")

    const handleClick = (action: string, value?: string) =>
    {
        if(!action) return

        switch(action)
        {
        case "alert_only":
            if(message.trim().length === 0) return

            SendMessageComposer(new ModeratorActionMessageComposer(ModeratorActionMessageComposer.ACTION_ALERT, message, ""))
            SendMessageComposer(new ModerateRoomMessageComposer(roomId, lockRoom ? 1 : 0, changeRoomName ? 1 : 0, kickUsers ? 1 : 0))
            return
        case "send_message":
            if(message.trim().length === 0) return

            SendMessageComposer(new ModeratorActionMessageComposer(ModeratorActionMessageComposer.ACTION_MESSAGE, message, ""))
            SendMessageComposer(new ModerateRoomMessageComposer(roomId, lockRoom ? 1 : 0, changeRoomName ? 1 : 0, kickUsers ? 1 : 0))
            return
        }
    }

    useMessageEvent<ModeratorRoomInfoEvent>(ModeratorRoomInfoEvent, event =>
    {
        const parser = event.getParser()

        if(!parser || parser.data.flatId !== roomId) return

        setLoadedRoomId(parser.data.flatId)
        setName(parser.data.room.name)
        setOwnerId(parser.data.ownerId)
        setOwnerName(parser.data.ownerName)
        setOwnerInRoom(parser.data.ownerInRoom)
        setUsersInRoom(parser.data.userCount)
    })

    useEffect(() =>
    {
        if(infoRequested) return
        
        SendMessageComposer(new GetModeratorRoomInfoMessageComposer(roomId))
        setInfoRequested(true)
    }, [ roomId, infoRequested, setInfoRequested ])

    return (
        <NitroCardView uniqueKey="mod-tools-room" className="illumina-mod-tools-room" windowPosition={ DraggableWindowPosition.TOP_LEFT }>
            <NitroCardHeaderView headerText="Room Info" onCloseClick={ event => onCloseClick() } />
            <NitroCardContentView>
                <div className="illumina-input mb-1.5 flex justify-between gap-8 p-1.5">
                    <div className="flex flex-col gap-1.5">
                        <div className="flex gap-1">
                            <p className="text-[13px] font-semibold !leading-3 [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">Room Owner:</p>
                            <p className="cursor-pointer text-[13px] !leading-3 underline" onClick={ () => CreateLinkEvent(`mod-tools/toggle-user-info/${ ownerId }`) }>{ ownerName }</p>
                        </div>
                        <div className="flex gap-1">
                            <p className="text-[13px] font-semibold !leading-3 [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">Users in room:</p>
                            <p className="text-[13px] !leading-3">{ usersInRoom }</p>
                        </div>
                        <div className="flex gap-1">
                            <p className="text-[13px] font-semibold !leading-3 [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">Owner in room:</p>
                            <p className="text-[13px] !leading-3">{ ownerInRoom ? "yes" : "no" }</p>
                        </div>
                    </div>
                    <div className="flex flex-col gap-0.5">
                        <Button onClick={ event => TryVisitRoom(roomId) }>Enter room</Button>
                        <Button onClick={ event => CreateLinkEvent(`mod-tools/open-room-chatlog/${ roomId }`) }>Chatlog</Button>
                        <Button disabled>Edit in HK</Button>
                        <Button onClick={() => SendMessageComposer(new GetCustomRoomFilterMessageComposer(roomId))}>Bobba List</Button>
                    </div>
                </div>
                <div className="illumina-input mb-1.5 flex flex-col gap-px p-1.5">
                    <div className="flex items-center gap-1.5">
                        <input id="kickUsers" type="checkbox" className="illumina-input" checked={ kickUsers } onChange={ event => setKickUsers(event.target.checked) } />
                        <label htmlFor="kickUsers" className="cursor-pointer text-[13px] !leading-3">Kick everyone out</label>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <input id="lockRoom" type="checkbox" className="illumina-input" checked={ lockRoom } onChange={ event => setLockRoom(event.target.checked) } />
                        <label htmlFor="lockRoom" className="cursor-pointer text-[13px] !leading-3">Enable the doorbell</label>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <input id="changeRoomName" type="checkbox" className="illumina-input" checked={ changeRoomName } onChange={ event => setChangeRoomName(event.target.checked) }/>
                        <label htmlFor="changeRoomName" className="cursor-pointer text-[13px] !leading-3">Change room name</label>
                    </div>
                </div>
                <div className="illumina-input mb-1.5 p-1">
                    <textarea className="illumina-scrollbar h-[46px] w-full !text-[13px]" spellCheck={ false } placeholder="Type a mandatory message to the users in this text box..." value={ message } onChange={ event => setMessage(event.target.value) } />
                </div>
                <div className="flex gap-7">
                    <Button className="w-full" onClick={ event => handleClick("send_message") }>Send Caution</Button>
                    <Button className="w-full" onClick={ event => handleClick("alert_only") }>Send Alert only</Button>
                </div>
            </NitroCardContentView>
        </NitroCardView>
    )
}
