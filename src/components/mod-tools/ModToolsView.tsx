import { ILinkEventTracker, RoomEngineEvent, RoomId, RoomObjectCategory, RoomObjectType } from "@nitrots/nitro-renderer"
import { FC, useEffect, useState } from "react"
import { AddEventLinkTracker, CreateLinkEvent, GetConfiguration, GetRoomSession, GetSessionDataManager, ISelectedUser, RemoveLinkEventTracker } from "../../api"
import { DraggableWindowPosition, NitroCardContentView, NitroCardHeaderView, NitroCardView } from "../../common"
import { useModTools, useObjectSelectedEvent, useRoomEngineEvent } from "../../hooks"
import { ModToolsChatlogView } from "./views/room/ModToolsChatlogView"
import { ModToolsRoomView } from "./views/room/ModToolsRoomView"
import { ModToolsTicketsView } from "./views/tickets/ModToolsTicketsView"
import { ModToolsUserChatlogView } from "./views/user/ModToolsUserChatlogView"
import { ModToolsUserView } from "./views/user/ModToolsUserView"

export const ModToolsView: FC<{}> = props =>
{
    const [ isVisible, setIsVisible ] = useState(true)
    const [ currentRoomId, setCurrentRoomId ] = useState<number>(-1)
    const [ selectedUser, setSelectedUser ] = useState<ISelectedUser>(null)
    const [ isTicketsVisible, setIsTicketsVisible ] = useState(false)
    const { openRooms = [], openRoomChatlogs = [], openUserChatlogs = [], openUserInfos = [], openRoomInfo = null, closeRoomInfo = null, toggleRoomInfo = null, openRoomChatlog = null, closeRoomChatlog = null, toggleRoomChatlog = null, openUserInfo = null, closeUserInfo = null, toggleUserInfo = null, openUserChatlog = null, closeUserChatlog = null, toggleUserChatlog = null } = useModTools()
    
    const isMod = GetSessionDataManager().isModerator
    const modToolsIsClosable: boolean = GetConfiguration<boolean>("illumina.mod_tools.closable")

    useRoomEngineEvent<RoomEngineEvent>([
        RoomEngineEvent.INITIALIZED,
        RoomEngineEvent.DISPOSED
    ], event =>
    {
        if(RoomId.isRoomPreviewerId(event.roomId)) return

        switch(event.type)
        {
        case RoomEngineEvent.INITIALIZED:
            setCurrentRoomId(event.roomId)
            return
        case RoomEngineEvent.DISPOSED:
            setCurrentRoomId(-1)
            return
        }
    })

    useObjectSelectedEvent(event =>
    {
        if(event.category !== RoomObjectCategory.UNIT) return

        const roomSession = GetRoomSession()

        if(!roomSession) return

        const userData = roomSession.userDataManager.getUserDataByIndex(event.id)

        if(!userData || userData.type !== RoomObjectType.USER) return

        setSelectedUser({ userId: userData.webID, username: userData.name })
    })

    useEffect(() =>
    {
        const linkTracker: ILinkEventTracker = {
            linkReceived: (url: string) =>
            {
                const parts = url.split("/")
        
                if(parts.length < 2) return
        
                switch(parts[1])
                {
                case "show":
                    setIsVisible(true)
                    return
                case "hide":
                    setIsVisible(false)
                    return
                case "toggle":
                    setIsVisible(prevValue => !prevValue)
                    return
                case "open-room-info":
                    openRoomInfo(Number(parts[2]))
                    return
                case "close-room-info":
                    closeRoomInfo(Number(parts[2]))           
                    return
                case "toggle-room-info":
                    toggleRoomInfo(Number(parts[2]))
                    return
                case "open-room-chatlog":
                    openRoomChatlog(Number(parts[2]))
                    return
                case "close-room-chatlog":
                    closeRoomChatlog(Number(parts[2]))             
                    return
                case "toggle-room-chatlog":
                    toggleRoomChatlog(Number(parts[2]))
                    return
                case "open-user-info":
                    openUserInfo(Number(parts[2]))
                    return
                case "close-user-info":
                    closeUserInfo(Number(parts[2]))             
                    return
                case "toggle-user-info":
                    toggleUserInfo(Number(parts[2]))
                    return
                case "open-user-chatlog":
                    openUserChatlog(Number(parts[2]))   
                    return
                case "close-user-chatlog":
                    closeUserChatlog(Number(parts[2]))              
                    return
                case "toggle-user-chatlog":
                    toggleUserChatlog(Number(parts[2]))
                    return
                }
            },
            eventUrlPrefix: "mod-tools/"
        }

        AddEventLinkTracker(linkTracker)

        return () => RemoveLinkEventTracker(linkTracker)
    }, [ openRoomInfo, closeRoomInfo, toggleRoomInfo, openRoomChatlog, closeRoomChatlog, toggleRoomChatlog, openUserInfo, closeUserInfo, toggleUserInfo, openUserChatlog, closeUserChatlog, toggleUserChatlog ])

    return (
        <>
            { (isVisible && isMod) &&
                <NitroCardView uniqueKey="mod-tools" className="illumina-mod-tools size-[170px]" windowPosition={ DraggableWindowPosition.TOP_LEFT } >
                    <NitroCardHeaderView headerText={ "Mod Tools" } onCloseClick={ event => modToolsIsClosable && setIsVisible(false) } />
                    <NitroCardContentView className="text-black">
                        <div className="mt-1 flex flex-col gap-3">
                            <button className="flex items-center disabled:text-[#717171]" onClick={ event => CreateLinkEvent(`mod-tools/toggle-room-info/${ currentRoomId }`) } disabled={ (currentRoomId <= 0) }>
                                <div className="h-4 w-[21px]">
                                    <i className="block h-4 w-[17px] bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-426px_-84px]" />
                                </div>
                                <p className="text-xs font-semibold [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">Room tool for this room</p>
                            </button>
                            <button className="flex items-center disabled:text-[#717171]" onClick={ event => CreateLinkEvent(`mod-tools/toggle-room-chatlog/${ currentRoomId }`) } disabled={ (currentRoomId <= 0) }>
                                <div className="size-[21px]">
                                    <i className="block h-[21px] w-[17px] bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-395px_-84px]" />
                                </div>
                                <p className="text-xs font-semibold [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">Chatlog for this room</p>
                            </button>
                            <button className="flex items-center disabled:text-[#717171]" onClick={ () => CreateLinkEvent(`mod-tools/toggle-user-info/${ selectedUser.userId }`) } disabled={ !selectedUser }>
                                <div className="-ml-px h-[19px] w-[22px]">
                                    <i className="block h-[19px] w-[17px] bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-444px_-84px]" />
                                </div>
                                <p className="text-xs font-semibold [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">User info: { selectedUser ? selectedUser.username : "" }</p>
                            </button>
                            <button className="flex items-center disabled:text-[#717171]" onClick={ () => setIsTicketsVisible(prevValue => !prevValue) }>
                                <div className="h-4 w-[21px] pl-1">
                                    <i className="block h-4 w-3 bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-413px_-84px]" />
                                </div>
                                <p className="text-xs font-semibold [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">Ticket browser</p>
                            </button>
                        </div>
                    </NitroCardContentView>
                </NitroCardView> }
            { (openRooms.length > 0) && openRooms.map(roomId => <ModToolsRoomView key={ roomId } roomId={ roomId } onCloseClick={ () => CreateLinkEvent(`mod-tools/close-room-info/${ roomId }`) } />) }
            { (openRoomChatlogs.length > 0) && openRoomChatlogs.map(roomId => <ModToolsChatlogView key={ roomId } roomId={ roomId } onCloseClick={ () => CreateLinkEvent(`mod-tools/close-room-chatlog/${ roomId }`) } />) }
            { (openUserInfos.length > 0) && openUserInfos.map(userId => <ModToolsUserView key={ userId } userId={ userId } onCloseClick={ () => CreateLinkEvent(`mod-tools/close-user-info/${ userId }`) }/>) }
            { (openUserChatlogs.length > 0) && openUserChatlogs.map(userId => <ModToolsUserChatlogView key={ userId } userId={ userId } onCloseClick={ () => CreateLinkEvent(`mod-tools/close-user-chatlog/${ userId }`) }/>) }
            { isTicketsVisible && <ModToolsTicketsView onCloseClick={ () => setIsTicketsVisible(false) } /> }
        </>
    )
}
