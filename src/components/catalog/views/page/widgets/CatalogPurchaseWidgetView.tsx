import { PurchaseFromCatalogComposer } from '@nitrots/nitro-renderer';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { CreateLinkEvent, GetClubMemberLevel, LocalizeText } from '../../../../../api';
import { Button } from '../../../../../common/Button';
import { CatalogEvent, CatalogPurchasedEvent, CatalogPurchaseFailureEvent, CatalogPurchaseNotAllowedEvent, CatalogPurchaseSoldOutEvent } from '../../../../../events';
import { CatalogInitGiftEvent } from '../../../../../events/catalog/CatalogInitGiftEvent';
import { CatalogInitPurchaseEvent } from '../../../../../events/catalog/CatalogInitPurchaseEvent';
import { CatalogWidgetEvent } from '../../../../../events/catalog/CatalogWidgetEvent';
import { dispatchUiEvent, SendMessageHook, useUiEvent } from '../../../../../hooks';
import { LoadingSpinnerView } from '../../../../../layout';
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
    const { currentOffer = null, currentPage = null, purchaseOptions = null, setPurchaseOptions = null, getNodesByOfferId = null } = useCatalogContext();
    const { quantity = 1, extraData = '', extraParamRequired = false, previewStuffData = null } = purchaseOptions;

    const onCatalogInitPurchaseEvent = useCallback((event: CatalogInitPurchaseEvent) =>
    {
        if(!currentOffer) return;

        // show purchase confirmation
        // offer, page.pageId, extraData, quantity, previewStuffData, null, true, null
    }, [ currentOffer ]);

    useUiEvent(CatalogWidgetEvent.INIT_PURCHASE, onCatalogInitPurchaseEvent);

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

    useUiEvent(CatalogPurchasedEvent.PURCHASE_SUCCESS, onCatalogEvent);
    useUiEvent(CatalogPurchaseFailureEvent.PURCHASE_FAILED, onCatalogEvent);
    useUiEvent(CatalogPurchaseNotAllowedEvent.NOT_ALLOWED, onCatalogEvent);
    useUiEvent(CatalogPurchaseSoldOutEvent.SOLD_OUT, onCatalogEvent);

    const isLimitedSoldOut = useMemo(() =>
    {
        if(!currentOffer) return false;
        
        if(extraParamRequired && (!extraData || !extraData.length)) return false;

        if(currentOffer.pricingModel === Offer.PRICING_MODEL_SINGLE)
        {
            const product = currentOffer.product;

            if(product && product.isUniqueLimitedItem) return !product.uniqueLimitedItemsLeft;
        }

        return false;
    }, [ currentOffer, extraParamRequired, extraData ]);

    const purchase = useCallback((isGift: boolean = false) =>
    {
        if(!currentOffer) return;

        if(GetClubMemberLevel() < currentOffer.clubLevel)
        {
            CreateLinkEvent('habboUI/open/hccenter');

            return;
        }

        if(isGift)
        {
            dispatchUiEvent(new CatalogInitGiftEvent(currentOffer.page.pageId, currentOffer.offerId, extraData));

            return;
        }

        setPurchaseState(CatalogPurchaseState.PURCHASE);

        if(purchaseCallback)
        {
            purchaseCallback();

            return;
        }

        let pageId = currentOffer.page.pageId;

        if(pageId === -1)
        {
            const nodes = getNodesByOfferId(currentOffer.offerId);

            if(nodes) pageId = nodes[0].pageId;
        }

        SendMessageHook(new PurchaseFromCatalogComposer(pageId, currentOffer.offerId, extraData, quantity));
    }, [ currentOffer, purchaseCallback, extraData, quantity, getNodesByOfferId ]);

    useEffect(() =>
    {
        if(!currentOffer) return;

        return () =>
        {
            setPurchaseState(CatalogPurchaseState.NONE);
            setPurchaseOptions({ quantity: 1, extraData: '', extraParamRequired: false, previewStuffData: null });
        }
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
        const priceCredits = (currentOffer.priceInCredits * quantity);
        const pricePoints = (currentOffer.priceInActivityPoints * quantity);

        if(GetClubMemberLevel() < currentOffer.clubLevel) return <Button variant="danger" disabled>{ LocalizeText('catalog.alert.hc.required') }</Button>;

        if(isLimitedSoldOut) return <Button variant="danger" disabled>{ LocalizeText('catalog.alert.limited_edition_sold_out.title') }</Button>;

        if(priceCredits > GetCurrencyAmount(-1)) return <Button variant="danger" disabled>{ LocalizeText('catalog.alert.notenough.title') }</Button>;

        if(pricePoints > GetCurrencyAmount(currentOffer.activityPointType)) return <Button variant="danger" disabled>{ LocalizeText('catalog.alert.notenough.activitypoints.title.' + currentOffer.activityPointType) }</Button>;

        switch(purchaseState)
        {
            case CatalogPurchaseState.CONFIRM:
                return <Button onClick={ event => purchase() }>{ LocalizeText('catalog.marketplace.confirm_title') }</Button>;
            case CatalogPurchaseState.PURCHASE:
                return <Button disabled><LoadingSpinnerView /></Button>;
            case CatalogPurchaseState.FAILED:
                return <Button variant="danger">{ LocalizeText('generic.failed') }</Button>;
            case CatalogPurchaseState.SOLD_OUT:
                return <Button variant="danger">{ LocalizeText('generic.failed') + ' - ' + LocalizeText('catalog.alert.limited_edition_sold_out.title') }</Button>;
            case CatalogPurchaseState.NONE:
            default:
                return <Button disabled={ (extraParamRequired && (!extraData || !extraData.length)) } onClick={ event => setPurchaseState(CatalogPurchaseState.CONFIRM) }>{ LocalizeText('catalog.purchase_confirmation.' + (currentOffer.isRentOffer ? 'rent' : 'buy')) }</Button>;
        }
    }

    return (
        <>
            <PurchaseButton />
            { (!noGiftOption && !currentOffer.isRentOffer) &&
                <Button disabled={ ((quantity > 1) || !currentOffer.giftable || isLimitedSoldOut || (extraParamRequired && (!extraData || !extraData.length))) } onClick={ event => purchase(true) }>
                    { LocalizeText('catalog.purchase_confirmation.gift') }
                </Button> }
        </>
    );
}
