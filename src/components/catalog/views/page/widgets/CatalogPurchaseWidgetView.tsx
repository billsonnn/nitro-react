import { PurchaseFromCatalogComposer } from "@nitrots/nitro-renderer"
import { FC, useCallback, useEffect, useMemo, useState } from "react"
import { CatalogPurchaseState, CreateLinkEvent, DispatchUiEvent, GetClubMemberLevel, GetConfiguration, LocalizeText, Offer, SendMessageComposer } from "../../../../../api"
import { PurchaseNotificationType } from "../../../../../api/inventory/PurchaseNotificationType"
import { Button, LayoutNotificationAlertView } from "../../../../../common"
import { CatalogEvent, CatalogInitGiftEvent, CatalogPurchaseFailureEvent, CatalogPurchaseNotAllowedEvent, CatalogPurchaseSoldOutEvent, CatalogPurchasedEvent } from "../../../../../events"
import { useCatalog, useNotification, usePurse, useUiEvent } from "../../../../../hooks"
import { CatalogPriceDisplayWidgetView } from "./CatalogPriceDisplayWidgetView"
import { PurchaseViewProductWidgetView } from "./PurchaseViewProductWidgetView"

interface CatalogPurchaseWidgetViewProps
{
    noGiftOption?: boolean;
    purchaseCallback?: () => void;
    isPet?: boolean;
}

export const CatalogPurchaseWidgetView: FC<CatalogPurchaseWidgetViewProps> = props =>
{
    const { noGiftOption = false, purchaseCallback = null, isPet = false } = props
    const [ purchaseState, setPurchaseState ] = useState(CatalogPurchaseState.NONE)
    const { currentOffer = null, purchaseOptions = null, setPurchaseOptions = null } = useCatalog()
    const { getCurrencyAmount = null } = usePurse()
    const { showPurchaseAlert = null } = useNotification()

    const isPurchasePopup: boolean = GetConfiguration<boolean>("illumina.purchase.popup")

    const onCatalogEvent = useCallback((event: CatalogEvent) =>
    {
        switch(event.type)
        {
        case CatalogPurchasedEvent.PURCHASE_SUCCESS:
            setPurchaseState(CatalogPurchaseState.NONE)
            return
        case CatalogPurchaseFailureEvent.PURCHASE_FAILED:
            setPurchaseState(CatalogPurchaseState.FAILED)
            return
        case CatalogPurchaseNotAllowedEvent.NOT_ALLOWED:
            setPurchaseState(CatalogPurchaseState.FAILED)
            return
        case CatalogPurchaseSoldOutEvent.SOLD_OUT:
            setPurchaseState(CatalogPurchaseState.SOLD_OUT)
            return
        }
    }, [])

    useUiEvent(CatalogPurchasedEvent.PURCHASE_SUCCESS, onCatalogEvent)
    useUiEvent(CatalogPurchaseFailureEvent.PURCHASE_FAILED, onCatalogEvent)
    useUiEvent(CatalogPurchaseNotAllowedEvent.NOT_ALLOWED, onCatalogEvent)
    useUiEvent(CatalogPurchaseSoldOutEvent.SOLD_OUT, onCatalogEvent)

    const isLimitedSoldOut = useMemo(() =>
    {
        if(!currentOffer) return false
        
        if(purchaseOptions.extraParamRequired && (!purchaseOptions.extraData || !purchaseOptions.extraData.length)) return false

        if(currentOffer.pricingModel === Offer.PRICING_MODEL_SINGLE)
        {
            const product = currentOffer.product

            if(product && product.isUniqueLimitedItem) return !product.uniqueLimitedItemsLeft
        }

        return false
    }, [ currentOffer, purchaseOptions ])

    const purchase = (isGift: boolean = false) =>
    {
        if(!currentOffer) return

        if(GetClubMemberLevel() < currentOffer.clubLevel)
        {
            CreateLinkEvent("habboUI/open/hccenter")

            return
        }
        
        if(isGift)
        {
            DispatchUiEvent(new CatalogInitGiftEvent(currentOffer.page.pageId, currentOffer.offerId, purchaseOptions.extraData))

            return
        }
        
        setPurchaseState(CatalogPurchaseState.PURCHASE)
        
        if(purchaseCallback)
        {
            purchaseCallback()

            return
        }

        let pageId = currentOffer.page.pageId
        SendMessageComposer(new PurchaseFromCatalogComposer(pageId, currentOffer.offerId, purchaseOptions.extraData, purchaseOptions.quantity))
    }

    const handleBuy = () =>
    {
        const priceCredits = (currentOffer.priceInCredits * purchaseOptions.quantity)
        const pricePoints = (currentOffer.priceInActivityPoints * purchaseOptions.quantity)

        if(isLimitedSoldOut)
        {
            showPurchaseAlert(PurchaseNotificationType.SOLD_OUT)
        } else if(((priceCredits > getCurrencyAmount(-1)) && (pricePoints > getCurrencyAmount(currentOffer.activityPointType)) && (currentOffer.activityPointType === 0)))
        {
            showPurchaseAlert(PurchaseNotificationType.NOT_ENOUGH_CREDITS_DUCKETS)
        } else if(priceCredits > getCurrencyAmount(-1))
        {
            showPurchaseAlert(PurchaseNotificationType.NOT_ENOUGH_CREDITS)
        } else if((pricePoints > getCurrencyAmount(currentOffer.activityPointType) && currentOffer.activityPointType === 0))
        {
            showPurchaseAlert(PurchaseNotificationType.NOT_ENOUGH_DUCKETS)
        } else if((pricePoints > getCurrencyAmount(currentOffer.activityPointType) && currentOffer.activityPointType === 5))
        {
            showPurchaseAlert(PurchaseNotificationType.NOT_ENOUGH_DIAMONDS)
        } else if((pricePoints > getCurrencyAmount(currentOffer.activityPointType) && currentOffer.activityPointType === 104))
        {
            showPurchaseAlert(PurchaseNotificationType.NOT_ENOUGH_CLOUDS)
        } else if(GetClubMemberLevel() < currentOffer.clubLevel) {
            CreateLinkEvent("habboUI/open/hccenter")
        } else
        {
            setPurchaseState(CatalogPurchaseState.CONFIRM)
        }
    }

    const PurchaseButton = () =>
    {
        const priceCredits = (currentOffer.priceInCredits * purchaseOptions.quantity)
        const pricePoints = (currentOffer.priceInActivityPoints * purchaseOptions.quantity)

        if(GetClubMemberLevel() < currentOffer.clubLevel) return <Button className="w-full" disabled>{ LocalizeText("catalog.alert.hc.required") }</Button>

        if(isLimitedSoldOut) return <Button className="w-full" disabled>{ LocalizeText("catalog.alert.limited_edition_sold_out.title") }</Button>

        if(priceCredits > getCurrencyAmount(-1)) return <Button className="w-full" disabled>{ LocalizeText("catalog.alert.notenough.title") }</Button>

        if(pricePoints > getCurrencyAmount(currentOffer.activityPointType)) return <Button className="w-full" disabled>{ LocalizeText("catalog.alert.notenough.activitypoints.title." + currentOffer.activityPointType) }</Button>

        switch(purchaseState)
        {
        case CatalogPurchaseState.CONFIRM:
            return <Button variant="success" className="w-full" onClick={ event => purchase() }>{ LocalizeText("catalog.marketplace.confirm_title") }</Button>
        case CatalogPurchaseState.PURCHASE:
            return <Button className="w-full" disabled>{ LocalizeText("generic.loading") }</Button>
        case CatalogPurchaseState.FAILED:
            return <Button className="w-full">{ LocalizeText("generic.failed") }</Button>
        case CatalogPurchaseState.SOLD_OUT:
            return <Button className="w-full">{ LocalizeText("generic.failed") + " - " + LocalizeText("catalog.alert.limited_edition_sold_out.title") }</Button>
        case CatalogPurchaseState.NONE:
        default:
            return <Button className="w-full" disabled={ (purchaseOptions.extraParamRequired && (!purchaseOptions.extraData || !purchaseOptions.extraData.length)) } onClick={ event => setPurchaseState(CatalogPurchaseState.CONFIRM) }>{ LocalizeText("catalog.purchase_confirmation." + (currentOffer.isRentOffer ? "rent" : "buy")) }</Button>
        }
    }

    useEffect(() =>
    {
        if(!currentOffer) return

        setPurchaseState(CatalogPurchaseState.NONE)
    }, [ currentOffer, setPurchaseOptions ])

    const PurchaseDialog = () => (
        <LayoutNotificationAlertView onClose={() => setPurchaseState(CatalogPurchaseState.NONE)} title={ LocalizeText("catalog.purchase_confirmation.title") } style={{ width: 325 }}>
            <div className="mb-4 flex gap-[25px]">
                <div className="illumina-previewer relative flex h-[152px] w-[126px] shrink-0 items-center justify-center overflow-hidden p-[3px]">
                    <PurchaseViewProductWidgetView isPet={ isPet } />
                </div>
                <div className="mt-7 w-full">
                    <p className="mb-9 w-full text-clip text-sm font-semibold [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">{currentOffer.localizationName}</p>
                    <div className="flex items-center gap-[5px]">
                        <p className="text-sm text-black">{LocalizeText("catalog.purchase.confirmation.dialog.cost")}</p>
                        <CatalogPriceDisplayWidgetView offer={ currentOffer } />
                    </div>
                </div>
            </div>
            <div className="flex items-center justify-between gap-[76px]">
                <Button className="w-full" variant="primary" onClick={() => setPurchaseState(CatalogPurchaseState.NONE)}>{ LocalizeText("generic.cancel") }</Button>
                <Button className="w-full" variant="success" disabled={purchaseState === CatalogPurchaseState.FAILED} onClick={() => purchase()}>{ LocalizeText("catalog.purchase_confirmation." + (currentOffer.isRentOffer ? "rent" : "buy")) }</Button>
            </div>
        </LayoutNotificationAlertView>
    )

    if(!currentOffer) return (
        <div className="illumina-card-item py-2.5">
            <p className="text-center text-sm font-semibold !leading-3 text-[#717171] [text-shadow:_0_1px_0_#fff] dark:text-[#605d53] dark:[text-shadow:_0_1px_0_#33312B]">{LocalizeText("catalog.purchase.select.info")}</p>
        </div>
    )

    return (
        <div className="flex gap-2.5">
            {(purchaseState === CatalogPurchaseState.CONFIRM && isPurchasePopup) && <PurchaseDialog /> }
            {isLimitedSoldOut
                ? <div className="relative h-[30px] w-[360px] bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-102px_-181px]">
                    <div className="absolute right-[17px] top-1 flex h-[22px] w-[140px] items-center justify-center">
                        <p className="text-center text-sm font-semibold !leading-3 text-[#414759] [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">{LocalizeText("catalog.alert.limited_edition_sold_out.title")}</p>
                    </div>
                </div>
                : <>
                    { (!noGiftOption && !currentOffer.isRentOffer) &&
                        <Button className="w-full" disabled={ ((purchaseOptions.quantity > 1) || !currentOffer.giftable || isLimitedSoldOut || (purchaseOptions.extraParamRequired && (!purchaseOptions.extraData || !purchaseOptions.extraData.length))) } onClick={ event => purchase(true) }>
                            { LocalizeText("catalog.purchase_confirmation.gift") }
                        </Button> }
                    { isPurchasePopup
                        ? <Button className="w-full" variant="success" disabled={ (purchaseOptions.extraParamRequired && (!purchaseOptions.extraData || !purchaseOptions.extraData.length)) } onClick={ event => handleBuy() }>{ LocalizeText("catalog.purchase_confirmation." + (currentOffer.isRentOffer ? "rent" : "buy")) }</Button>
                        : <PurchaseButton /> }
                </> }
        </div>
    )
}
