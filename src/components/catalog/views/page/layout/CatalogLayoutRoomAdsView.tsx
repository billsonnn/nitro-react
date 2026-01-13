import { GetRoomAdPurchaseInfoComposer, GetUserEventCatsMessageComposer, PurchaseRoomAdMessageComposer, RoomAdPurchaseInfoEvent, RoomEntryData } from "@nitrots/nitro-renderer"
import { FC, useEffect, useState } from "react"
import { SendMessageComposer } from "../../../../../api"
import { useCatalog, useMessageEvent, useNavigator, useRoomPromote } from "../../../../../hooks"
import { CatalogLayoutProps } from "./CatalogLayout.types"

export const CatalogLayoutRoomAdsView: FC<CatalogLayoutProps> = props =>
{
    const { page = null } = props
    const [ eventName, setEventName ] = useState<string>("")
    const [ eventDesc, setEventDesc ] = useState<string>("")
    const [ roomId, setRoomId ] = useState<number>(-1)
    const [ availableRooms, setAvailableRooms ] = useState<RoomEntryData[]>([])
    const [ extended, setExtended ] = useState<boolean>(false)
    const [ categoryId, setCategoryId ] = useState<number>(1)
    const { categories = null } = useNavigator()
    const { setIsVisible = null } = useCatalog()
    const { promoteInformation, isExtended, setIsExtended } = useRoomPromote()

    useEffect(() =>
    {
        if(isExtended)
        {
            setRoomId(promoteInformation.data.flatId)
            setEventName(promoteInformation.data.eventName)
            setEventDesc(promoteInformation.data.eventDescription)
            setCategoryId(promoteInformation.data.categoryId)
            setExtended(isExtended) // This is for sending to packet
            setIsExtended(false) // This is from hook useRoomPromotte
        }

    }, [ isExtended, eventName, eventDesc, categoryId ])

    const resetData = () =>
    {
        setRoomId(-1)
        setEventName("")
        setEventDesc("")
        setCategoryId(1)
        setIsExtended(false)
        setIsVisible(false)
    }

    const purchaseAd = () =>
    {
        const pageId = page.pageId
        const offerId = page.offers.length >= 1 ? page.offers[0].offerId : -1
        const flatId = roomId
        const name = eventName
        const desc = eventDesc
        const catId = categoryId

        SendMessageComposer(new PurchaseRoomAdMessageComposer(pageId, offerId, flatId, name, extended, desc, catId))
        resetData()
    }

    useMessageEvent<RoomAdPurchaseInfoEvent>(RoomAdPurchaseInfoEvent, event =>
    {
        const parser = event.getParser()

        if(!parser) return

        setAvailableRooms(parser.rooms)
    })

    useEffect(() =>
    {
        SendMessageComposer(new GetRoomAdPurchaseInfoComposer())
        // TODO: someone needs to fix this for morningstar
        SendMessageComposer(new GetUserEventCatsMessageComposer())
    }, [])

    return null
}

interface INavigatorCategory {
    id: number;
    name: string;
    visible: boolean;
}
