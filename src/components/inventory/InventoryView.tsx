import { BadgePointLimitsEvent, ILinkEventTracker, IRoomSession, RoomEngineObjectEvent, RoomEngineObjectPlacedEvent, RoomPreviewer, RoomSessionEvent } from "@nitrots/nitro-renderer"
import { FC, useEffect, useState } from "react"
import { AddEventLinkTracker, GetLocalization, GetRoomEngine, LocalizeText, RemoveLinkEventTracker, UnseenItemCategory, isObjectMoverRequested, setObjectMoverRequested } from "../../api"
import { DraggableWindowPosition, NitroCardContentView, NitroCardHeaderView, NitroCardTabsItemView, NitroCardTabsView, NitroCardView } from "../../common"
import { useInventoryTrade, useInventoryUnseenTracker, useMessageEvent, useRoomEngineEvent, useRoomSessionManagerEvent } from "../../hooks"
import { InventoryBadgeView } from "./views/badge/InventoryBadgeView"
import { InventoryBotView } from "./views/bot/InventoryBotView"
import { InventoryFurnitureView } from "./views/furniture/InventoryFurnitureView"
import { InventoryTradeView } from "./views/furniture/InventoryTradeView"
import { InventoryPetView } from "./views/pet/InventoryPetView"

const TAB_FURNITURE: string = "furnis"
const TAB_PETS: string = "pets"
const TAB_BADGES: string = "badges"
const TAB_BOTS: string = "bots"
const TABS = [ TAB_FURNITURE, TAB_PETS, TAB_BADGES, TAB_BOTS ]
const UNSEEN_CATEGORIES = [ UnseenItemCategory.FURNI, UnseenItemCategory.PET, UnseenItemCategory.BADGE, UnseenItemCategory.BOT ]

export const InventoryView: FC<{}> = props =>
{
    const [ isVisible, setIsVisible ] = useState(false)
    const [ currentTab, setCurrentTab ] = useState<string>(TABS[0])
    const [ roomSession, setRoomSession ] = useState<IRoomSession>(null)
    const [ roomPreviewer, setRoomPreviewer ] = useState<RoomPreviewer>(null)
    const { isTrading = false, stopTrading = null } = useInventoryTrade()
    const { getCount = null, resetCategory = null } = useInventoryUnseenTracker()

    const onClose = () =>
    {
        if(isTrading) stopTrading()

        setIsVisible(false)
    }

    useRoomEngineEvent<RoomEngineObjectPlacedEvent>(RoomEngineObjectEvent.PLACED, event =>
    {
        if(!isObjectMoverRequested()) return

        setObjectMoverRequested(false)

        if(!event.placedInRoom) setIsVisible(true)
    })

    useRoomSessionManagerEvent<RoomSessionEvent>([
        RoomSessionEvent.CREATED,
        RoomSessionEvent.ENDED
    ], event =>
    {
        switch(event.type)
        {
        case RoomSessionEvent.CREATED:
            setRoomSession(event.session)
            return
        case RoomSessionEvent.ENDED:
            setRoomSession(null)
            setIsVisible(false)
            return
        }
    })

    useMessageEvent<BadgePointLimitsEvent>(BadgePointLimitsEvent, event =>
    {
        const parser = event.getParser()

        for(const data of parser.data) GetLocalization().setBadgePointLimit(data.badgeId, data.limit)
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
                }
            },
            eventUrlPrefix: "inventory/"
        }

        AddEventLinkTracker(linkTracker)

        return () => RemoveLinkEventTracker(linkTracker)
    }, [])

    useEffect(() =>
    {
        setRoomPreviewer(new RoomPreviewer(GetRoomEngine(), ++RoomPreviewer.PREVIEW_COUNTER))

        return () =>
        {
            setRoomPreviewer(prevValue =>
            {
                prevValue.dispose()

                return null
            })
        }
    }, [])

    useEffect(() =>
    {
        if(!isVisible && isTrading) setIsVisible(true)
    }, [ isVisible, isTrading ])

    if(!isVisible) return null

    return (
        <NitroCardView uniqueKey="inventory" windowPosition={ DraggableWindowPosition.TOP_LEFT } className="illumina-inventory min-h-[350px] w-[490px]">
            <NitroCardHeaderView headerText={ LocalizeText("inventory.title") } onCloseClick={ onClose } />
            { !isTrading &&
                <>
                    <NitroCardTabsView className="!justify-start !gap-0.5">
                        { TABS.map((name, index) => {
                            return (
                                <NitroCardTabsItemView key={ index } isActive={ (currentTab === name) } onClick={ event => setCurrentTab(name) } count={ getCount(UNSEEN_CATEGORIES[index]) }>
                                    {name === "furnis" && <i className="h-[18px] w-[15px] bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-103px_0px]" /> }
                                    {name === "pets" && <i className="h-[15px] w-[17px] bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-119px_0px]" /> }
                                    {name === "badges" && <i className="h-4 w-[17px] bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-137px_0px]" /> }
                                    {name === "bots" && <i className="size-[18px] bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-155px_0px]" /> }
                                </NitroCardTabsItemView>
                            )
                        })}
                    </NitroCardTabsView>
                    <NitroCardContentView overflow="hidden" className="h-max">
                        <div className="my-[5px] h-0.5 w-full border-b border-white bg-[#CCCCCC] dark:border-[#36322C] dark:bg-black" />
                        { (currentTab === TAB_FURNITURE) &&
                            <InventoryFurnitureView roomSession={ roomSession } roomPreviewer={ roomPreviewer } /> }
                        { (currentTab === TAB_PETS) && 
                            <InventoryPetView roomSession={ roomSession } roomPreviewer={ roomPreviewer } /> }
                        { (currentTab === TAB_BADGES) && 
                            <InventoryBadgeView /> }
                        { (currentTab === TAB_BOTS) &&
                            <InventoryBotView roomSession={ roomSession } roomPreviewer={ roomPreviewer } /> }
                    </NitroCardContentView>
                </> }
            { isTrading &&
                <NitroCardContentView>
                    <InventoryTradeView cancelTrade={onClose} roomPreviewer={ roomPreviewer } />
                </NitroCardContentView> }
        </NitroCardView>
    )
}
