import { PurchaseFromCatalogComposer } from '@nitrots/nitro-renderer';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { CreateLinkEvent, GetClubMemberLevel, LocalizeText, SendMessageComposer } from '../../../../../api';
import { Button, LayoutLoadingSpinnerView } from '../../../../../common';
import { CatalogEvent, CatalogInitGiftEvent, CatalogInitPurchaseEvent, CatalogPurchasedEvent, CatalogPurchaseFailureEvent, CatalogPurchaseNotAllowedEvent, CatalogPurchaseSoldOutEvent, CatalogSetExtraPurchaseParameterEvent, CatalogWidgetEvent } from '../../../../../events';
import { DispatchUiEvent, UseUiEvent } from '../../../../../hooks';
import { GetCurrencyAmount } from '../../../../purse/common/CurrencyHelper';
import { useCatalogContext } from '../../../CatalogContext';
import { CatalogPurchaseState } from '../../../common/CatalogPurchaseState';
import { Offer } from '../../../common/Offer';

interface CatalogPurchaseWidgetViewProps
{
    noGiftOption?: boolean;
    purchaseCallback?: () => void;
}

export const CatalogPurchaseWidgetView: FC<CatalogPurchaseWidgetViewProps> = props =>
{
    const { noGiftOption = false, purchaseCallback = null } = props;
    const [ purchaseWillBeGift, setPurchaseWillBeGift ] = useState(false);
    const [ purchaseState, setPurchaseState ] = useState(CatalogPurchaseState.NONE);
    const { currentOffer = null, currentPage = null, purchaseOptions = null, setPurchaseOptions = null } = useCatalogContext();

    const onCatalogInitPurchaseEvent = useCallback((event: CatalogInitPurchaseEvent) =>
    {
        if(!currentOffer) return;

        // show purchase confirmation
        // offer, page.pageId, extraData, quantity, previewStuffData, null, true, null
    }, [ currentOffer ]);

    UseUiEvent(CatalogWidgetEvent.INIT_PURCHASE, onCatalogInitPurchaseEvent);

    const onCatalogSetExtraPurchaseParameterEvent = useCallback((event: CatalogSetExtraPurchaseParameterEvent) =>
    {
        if(!currentOffer) return;

        setPurchaseOptions(prevValue =>
            {
                const newValue = { ...prevValue };

                newValue.extraData = event.parameter;

                return newValue;
            });
    }, [ currentOffer, setPurchaseOptions ]);

    UseUiEvent(CatalogWidgetEvent.SET_EXTRA_PARM, onCatalogSetExtraPurchaseParameterEvent);

    const onCatalogEvent = useCallback((event: CatalogEvent) =>
    {
        switch(event.type)
        {
            case CatalogPurchasedEvent.PURCHASE_SUCCESS:
                setPurchaseState(CatalogPurchaseState.NONE);
                return;
            case CatalogPurchaseFailureEvent.PURCHASE_FAILED:
                setPurchaseState(CatalogPurchaseState.FAILED);
                return;
            case CatalogPurchaseNotAllowedEvent.NOT_ALLOWED:
                setPurchaseState(CatalogPurchaseState.FAILED);
                return;
            case CatalogPurchaseSoldOutEvent.SOLD_OUT:
                setPurchaseState(CatalogPurchaseState.SOLD_OUT);
                return;
        }
    }, []);

    UseUiEvent(CatalogPurchasedEvent.PURCHASE_SUCCESS, onCatalogEvent);
    UseUiEvent(CatalogPurchaseFailureEvent.PURCHASE_FAILED, onCatalogEvent);
    UseUiEvent(CatalogPurchaseNotAllowedEvent.NOT_ALLOWED, onCatalogEvent);
    UseUiEvent(CatalogPurchaseSoldOutEvent.SOLD_OUT, onCatalogEvent);

    const isLimitedSoldOut = useMemo(() =>
    {
        if(!currentOffer) return false;
        
        if(purchaseOptions.extraParamRequired && (!purchaseOptions.extraData || !purchaseOptions.extraData.length)) return false;

        if(currentOffer.pricingModel === Offer.PRICING_MODEL_SINGLE)
        {
            const product = currentOffer.product;

            if(product && product.isUniqueLimitedItem) return !product.uniqueLimitedItemsLeft;
        }

        return false;
    }, [ currentOffer, purchaseOptions ]);

    const purchase = (isGift: boolean = false) =>
    {
        if(!currentOffer) return;

        if(GetClubMemberLevel() < currentOffer.clubLevel)
        {
            CreateLinkEvent('habboUI/open/hccenter');

            return;
        }

        if(isGift)
        {
            DispatchUiEvent(new CatalogInitGiftEvent(currentOffer.page.pageId, currentOffer.offerId, purchaseOptions.extraData));

            return;
        }

        setPurchaseState(CatalogPurchaseState.PURCHASE);

        if(purchaseCallback)
        {
            purchaseCallback();

            return;
        }

        let pageId = currentOffer.page.pageId;

        // if(pageId === -1)
        // {
        //     const nodes = getNodesByOfferId(currentOffer.offerId);

        //     if(nodes) pageId = nodes[0].pageId;
        // }

        SendMessageComposer(new PurchaseFromCatalogComposer(pageId, currentOffer.offerId, purchaseOptions.extraData, purchaseOptions.quantity));
    }

    useEffect(() =>
    {
        if(!currentOffer) return;

        setPurchaseState(CatalogPurchaseState.NONE);
        setPurchaseOptions({ quantity: 1, extraData: '', extraParamRequired: false, previewStuffData: null });
    }, [ currentOffer, setPurchaseOptions ]);

    useEffect(() =>
    {
        let timeout: ReturnType<typeof setTimeout> = null;

        if((purchaseState === CatalogPurchaseState.CONFIRM) || (purchaseState === CatalogPurchaseState.FAILED))
        {
            timeout = setTimeout(() => setPurchaseState(CatalogPurchaseState.NONE), 3000);
        }

        return () =>
        {
            if(timeout) clearTimeout(timeout);
        }
    }, [ purchaseState ]);

    if(!currentOffer) return null;

    const PurchaseButton = () =>
    {
        const priceCredits = (currentOffer.priceInCredits * purchaseOptions.quantity);
        const pricePoints = (currentOffer.priceInActivityPoints * purchaseOptions.quantity);

        if(GetClubMemberLevel() < currentOffer.clubLevel) return <Button variant="danger" disabled>{ LocalizeText('catalog.alert.hc.required') }</Button>;

        if(isLimitedSoldOut) return <Button variant="danger" disabled>{ LocalizeText('catalog.alert.limited_edition_sold_out.title') }</Button>;

        if(priceCredits > GetCurrencyAmount(-1)) return <Button variant="danger" disabled>{ LocalizeText('catalog.alert.notenough.title') }</Button>;

        if(pricePoints > GetCurrencyAmount(currentOffer.activityPointType)) return <Button variant="danger" disabled>{ LocalizeText('catalog.alert.notenough.activitypoints.title.' + currentOffer.activityPointType) }</Button>;

        switch(purchaseState)
        {
            case CatalogPurchaseState.CONFIRM:
                return <Button onClick={ event => purchase() }>{ LocalizeText('catalog.marketplace.confirm_title') }</Button>;
            case CatalogPurchaseState.PURCHASE:
                return <Button disabled><LayoutLoadingSpinnerView /></Button>;
            case CatalogPurchaseState.FAILED:
                return <Button variant="danger">{ LocalizeText('generic.failed') }</Button>;
            case CatalogPurchaseState.SOLD_OUT:
                return <Button variant="danger">{ LocalizeText('generic.failed') + ' - ' + LocalizeText('catalog.alert.limited_edition_sold_out.title') }</Button>;
            case CatalogPurchaseState.NONE:
            default:
                return <Button disabled={ (purchaseOptions.extraParamRequired && (!purchaseOptions.extraData || !purchaseOptions.extraData.length)) } onClick={ event => setPurchaseState(CatalogPurchaseState.CONFIRM) }>{ LocalizeText('catalog.purchase_confirmation.' + (currentOffer.isRentOffer ? 'rent' : 'buy')) }</Button>;
        }
    }

    return (
        <>
            <PurchaseButton />
            { (!noGiftOption && !currentOffer.isRentOffer) &&
                <Button disabled={ ((purchaseOptions.quantity > 1) || !currentOffer.giftable || isLimitedSoldOut || (purchaseOptions.extraParamRequired && (!purchaseOptions.extraData || !purchaseOptions.extraData.length))) } onClick={ event => purchase(true) }>
                    { LocalizeText('catalog.purchase_confirmation.gift') }
                </Button> }
        </>
    );
}
