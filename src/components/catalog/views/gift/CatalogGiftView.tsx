import { GiftReceiverNotFoundEvent, PurchaseFromCatalogAsGiftComposer } from "@nitrots/nitro-renderer"
import { ChangeEvent, FC, useCallback, useEffect, useMemo, useState } from "react"
import { ColorUtils, GetSessionDataManager, LocalizeText, MessengerFriend, NotificationAlertType, ProductTypeEnum, SendMessageComposer } from "../../../../api"
import { Button, LayoutCurrencyIcon, LayoutFurniImageView, LayoutGiftTagView, NitroCardContentView, NitroCardHeaderView, NitroCardView } from "../../../../common"
import { CatalogEvent, CatalogInitGiftEvent, CatalogPurchasedEvent } from "../../../../events"
import { useCatalog, useFriends, useMessageEvent, useNotification, useUiEvent } from "../../../../hooks"

export const CatalogGiftView: FC<{}> = props =>
{
    const [ isVisible, setIsVisible ] = useState<boolean>(false)
    const [ pageId, setPageId ] = useState<number>(0)
    const [ offerId, setOfferId ] = useState<number>(0)
    const [ extraData, setExtraData ] = useState<string>("")
    const [ receiverName, setReceiverName ] = useState<string>("")
    const [ showMyFace, setShowMyFace ] = useState<boolean>(true)
    const [ message, setMessage ] = useState<string>("")
    const [ colors, setColors ] = useState<{ id: number, color: string }[]>([])
    const [ selectedBoxIndex, setSelectedBoxIndex ] = useState<number>(0)
    const [ selectedRibbonIndex, setSelectedRibbonIndex ] = useState<number>(0)
    const [ selectedColorId, setSelectedColorId ] = useState<number>(0)
    const [ maxBoxIndex, setMaxBoxIndex ] = useState<number>(0)
    const [ maxRibbonIndex, setMaxRibbonIndex ] = useState<number>(0)
    const [ receiverNotFound, setReceiverNotFound ] = useState<boolean>(false)
    const { catalogOptions = null } = useCatalog()
    const { friends } = useFriends()
    const { giftConfiguration = null } = catalogOptions
    const [ boxTypes, setBoxTypes ] = useState<number[]>([])
    const [ suggestions, setSuggestions ] = useState([])
    const [ isAutocompleteVisible, setIsAutocompleteVisible ] = useState(true)
    const { simpleAlert = null } = useNotification()

    const onClose = useCallback(() =>
    {
        setIsVisible(false)
        setPageId(0)
        setOfferId(0)
        setExtraData("")
        setReceiverName("")
        setShowMyFace(true)
        setMessage("")
        setSelectedBoxIndex(0)
        setSelectedRibbonIndex(0)
        setIsAutocompleteVisible(false)
        setSuggestions([])

        if(colors.length) setSelectedColorId(colors[0].id)
    }, [ colors ])

    const isBoxDefault = useMemo(() =>
    {
        return giftConfiguration ? (giftConfiguration.defaultStuffTypes.findIndex(s => (s === boxTypes[selectedBoxIndex])) > -1) : false
    }, [ boxTypes, giftConfiguration, selectedBoxIndex ])

    const boxExtraData = useMemo(() =>
    {
        if (!giftConfiguration) return ""

        return ((boxTypes[selectedBoxIndex] * 1000) + giftConfiguration.ribbonTypes[selectedRibbonIndex]).toString()
    }, [ giftConfiguration, selectedBoxIndex, selectedRibbonIndex, boxTypes ])

    const isColorable = useMemo(() =>
    {
        if (!giftConfiguration) return false

        if (isBoxDefault) return false

        const boxType = boxTypes[selectedBoxIndex]

        return (boxType === 8 || (boxType >= 3 && boxType <= 6)) ? false : true
    }, [ giftConfiguration, selectedBoxIndex, isBoxDefault, boxTypes ])

    const colourId = useMemo(() =>
    {
        return isBoxDefault ? boxTypes[selectedBoxIndex] : selectedColorId
    },[ isBoxDefault, boxTypes, selectedBoxIndex, selectedColorId ])

    const allFriends = friends.filter((friend: MessengerFriend) => friend.id !== -1)

    const onTextChanged = (e: ChangeEvent<HTMLInputElement>) =>
    {
        const value = e.target.value

        let suggestions = []

        if (value.length > 0)
        {
            suggestions = allFriends.sort().filter((friend: MessengerFriend) => friend.name.includes(value))
        }

        setReceiverName(value)
        setIsAutocompleteVisible(true)
        setSuggestions(suggestions)
    }

    const selectedReceiverName = (friendName: string) =>
    {
        setReceiverName(friendName)
        setIsAutocompleteVisible(false)
    }

    const handleAction = useCallback((action: string) =>
    {
        switch(action)
        {
        case "prev_box":
            setSelectedBoxIndex(value => (value === 0 ? maxBoxIndex : value - 1))
            return
        case "next_box":
            setSelectedBoxIndex(value => (value === maxBoxIndex ? 0 : value + 1))
            return
        case "prev_ribbon":
            setSelectedRibbonIndex(value => (value === 0 ? maxRibbonIndex : value - 1))
            return
        case "next_ribbon":
            setSelectedRibbonIndex(value => (value === maxRibbonIndex ? 0 : value + 1))
            return
        case "buy":
            if(!receiverName || (receiverName.length === 0))
            {
                simpleAlert(LocalizeText("catalog.gift_wrapping.receiver_not_found.info"), NotificationAlertType.ALERT, null, null, LocalizeText("catalog.gift_wrapping.receiver_not_found.title"))
                return
            }

            SendMessageComposer(new PurchaseFromCatalogAsGiftComposer(pageId, offerId, extraData, receiverName, message, colourId , selectedBoxIndex, selectedRibbonIndex, showMyFace))
            return
        }
    }, [ colourId, extraData, maxBoxIndex, maxRibbonIndex, message, offerId, pageId, receiverName, selectedBoxIndex, selectedRibbonIndex, showMyFace ])

    useMessageEvent<GiftReceiverNotFoundEvent>(GiftReceiverNotFoundEvent, event => simpleAlert(LocalizeText("catalog.gift_wrapping.receiver_not_found.info"), NotificationAlertType.ALERT, null, null, LocalizeText("catalog.gift_wrapping.receiver_not_found.title")))

    useUiEvent([
        CatalogPurchasedEvent.PURCHASE_SUCCESS,
        CatalogEvent.INIT_GIFT ], event =>
    {
        switch(event.type)
        {
        case CatalogPurchasedEvent.PURCHASE_SUCCESS:
            onClose()
            return
        case CatalogEvent.INIT_GIFT:
            const castedEvent = (event as CatalogInitGiftEvent)

            onClose()

            setPageId(castedEvent.pageId)
            setOfferId(castedEvent.offerId)
            setExtraData(castedEvent.extraData)
            setIsVisible(true)
            return
        }
    })

    useEffect(() =>
    {
        setReceiverNotFound(false)
    }, [ receiverName ])

    const createBoxTypes = useCallback(() =>
    {
        if (!giftConfiguration) return

        setBoxTypes(prev =>
        {
            let newPrev = [ ...giftConfiguration.boxTypes ]

            newPrev.push(giftConfiguration.defaultStuffTypes[ Math.floor((Math.random() * (giftConfiguration.defaultStuffTypes.length - 1))) ])

            setMaxBoxIndex(newPrev.length - 1)
            setMaxRibbonIndex(newPrev.length - 1)

            return newPrev
        })
    },[ giftConfiguration ])

    useEffect(() =>
    {
        if(!giftConfiguration) return

        const newColors: { id: number, color: string }[] = []

        for(const colorId of giftConfiguration.stuffTypes)
        {
            const giftData = GetSessionDataManager().getFloorItemData(colorId)

            if(!giftData) continue

            if(giftData.colors && giftData.colors.length > 0) newColors.push({ id: colorId, color: ColorUtils.makeColorNumberHex(giftData.colors[0]) })
        }

        createBoxTypes()

        if(newColors.length)
        {
            setSelectedColorId(newColors[0].id)
            setColors(newColors)
        }
    }, [ giftConfiguration, createBoxTypes ])

    useEffect(() =>
    {
        if (!isVisible) return

        createBoxTypes()
    },[ createBoxTypes, isVisible ])
    
    const boxName = "catalog.gift_wrapping_new.box." + (isBoxDefault ? "default" : boxTypes[selectedBoxIndex])
    const ribbonName = `catalog.gift_wrapping_new.ribbon.${ selectedRibbonIndex }`
    const priceText = "catalog.gift_wrapping_new." + (isBoxDefault ? "freeprice" : "price")

    if(!giftConfiguration || !giftConfiguration.isEnabled || !isVisible) return null

    return (
        <NitroCardView uniqueKey="catalog-gift" className="illumina-catalog-gift">
            <NitroCardHeaderView headerText={ LocalizeText("catalog.gift_wrapping.title") } onCloseClick={ onClose } />
            <NitroCardContentView className="text-black">
                <div className="relative mb-[17px]">
                    <div className="flex h-[26px] w-full items-center gap-[7px]">
                        <input type="text" className="illumina-input size-full bg-transparent px-[9px] text-[13px] italic text-black" placeholder={ LocalizeText("catalog.gift_wrapping.receiver") } value={ receiverName } onChange={ (e) => onTextChanged(e) } />
                        <i className="h-[18px] w-[17px] bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-335px_0px] bg-no-repeat" />
                    </div>
                    { (suggestions.length > 0 && isAutocompleteVisible) &&
                        <div className="illumina-scrollbar absolute top-full z-50 max-h-[100px] w-[calc(100%-24px)] border-x border-[#999999] bg-white px-0.5 dark:border-[#191512] dark:bg-[#33312b]">
                            { suggestions.map((friend: MessengerFriend) => (
                                <div key={ friend.id } className="w-full cursor-pointer px-0.5 py-1 text-sm hover:bg-[#CCD1DA] dark:hover:bg-[#211d19]" onClick={ (e) => selectedReceiverName(friend.name) }>{ friend.name }</div>
                            )) }
                        </div>
                    }
                </div>
                <LayoutGiftTagView figure={ GetSessionDataManager().figure } userName={ GetSessionDataManager().userName } message={ message } editable={ true } onChange={ (value) => setMessage(value) } />
                <div className="mt-12 flex items-center">
                    { selectedColorId &&
                        <div className="illumina-previewer mr-2.5 flex size-[82px] items-center justify-center overflow-hidden">
                            <LayoutFurniImageView productType={ ProductTypeEnum.FLOOR } productClassId={ colourId } extraData={ boxExtraData } />
                        </div> }
                    <div>
                        <div className="mb-[11px] flex">
                            <div className="mr-[11px] flex gap-1">
                                <Button variant="primary" className="!w-[26px] !px-0" onClick={ () => handleAction("prev_box") }>
                                    <i className="block h-[9px] w-2.5 bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-56px_-118px]" />
                                </Button>
                                <Button variant="primary" className="!w-[26px] !px-0" onClick={ () => handleAction("next_box") }>
                                    <i className="block h-[9px] w-2.5 bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-56px_-128px]" />
                                </Button>
                            </div>
                            <div className="flex flex-col gap-0.5">
                                <p className="text-sm font-semibold [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">{ LocalizeText(boxName) }</p>
                                <div className="flex items-center gap-1">
                                    <p className="text-sm">{ LocalizeText(priceText, [ "price" ], [ giftConfiguration.price.toString() ]) }</p>
                                    <LayoutCurrencyIcon currency={ -1 } />
                                </div>
                            </div>
                        </div>
                        <div className={`flex ${isColorable ? "" : "pointer-events-none opacity-50"}`}>
                            <div className="mr-[11px] flex gap-1">
                                <Button variant="primary" className="!w-[26px] !px-0" onClick={ () => handleAction("prev_ribbon") }>
                                    <i className="block h-[9px] w-2.5 bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-56px_-118px]" />
                                </Button>
                                <Button variant="primary" className="!w-[26px] !px-0" onClick={ () => handleAction("next_ribbon") }>
                                    <i className="block h-[9px] w-2.5 bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-56px_-128px]" />
                                </Button>
                            </div>
                            <p className="text-sm font-semibold [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">{ LocalizeText(ribbonName) }</p>
                        </div>
                    </div>
                </div>
                <div className={`mt-[9px] ${isColorable ? "" : "pointer-events-none opacity-50"}`}>
                    <p className="mb-1 text-sm font-semibold">
                        { LocalizeText("catalog.gift_wrapping.pick_color") }
                    </p>
                    <div className="flex gap-[3px]">
                        { colors.map(color =>
                            <Button key={ color.id } className={`!h-[22px] !w-[27px] !p-[5px] ${(color.id === selectedColorId) ? "!p-1.5" : ""}`} onClick={ () => setSelectedColorId(color.id) } disabled={ !isColorable }>
                                <div className={`size-full border ${(color.id === selectedColorId) ? "!border-[#00000027]" : "border-[#A4A4A4] dark:border-black"}`} style={ { backgroundColor: color.color } } />
                            </Button>
                        )}
                    </div>
                </div>
                <div className="mt-5 flex items-center justify-between">
                    <Button variant="underline" onClick={ onClose }>
                        { LocalizeText("cancel") }
                    </Button>
                    <Button className="!px-8" onClick={ () => handleAction("buy") }>
                        { LocalizeText("catalog.gift_wrapping.give_gift") }
                    </Button>
                </div>
            </NitroCardContentView>
        </NitroCardView>
    )
}
