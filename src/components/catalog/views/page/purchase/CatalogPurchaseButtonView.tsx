import { CatalogPageMessageOfferData, PurchaseFromCatalogComposer } from '@nitrots/nitro-renderer';
import { FC, useCallback, useEffect, useState } from 'react';
import { LocalizeText } from '../../../../../api';
import { Button, ButtonProps } from '../../../../../common/Button';
import { CatalogEvent } from '../../../../../events';
import { BatchUpdates } from '../../../../../hooks';
import { useUiEvent } from '../../../../../hooks/events/ui/ui-event';
import { SendMessageHook } from '../../../../../hooks/messages/message-event';
import { LoadingSpinnerView } from '../../../../../layout';
import { GetCurrencyAmount } from '../../../../../views/purse/common/CurrencyHelper';
import { CatalogPurchaseState } from '../../../common/CatalogPurchaseState';

export interface CatalogPurchaseButtonViewProps extends ButtonProps
{
    offer: CatalogPageMessageOfferData;
    pageId: number;
    extra?: string;
    quantity?: number;
    isPurchaseAllowed?: boolean;
    beforePurchase?: () => void;
}

export const CatalogPurchaseButtonView: FC<CatalogPurchaseButtonViewProps> = props =>
{
    const { offer = null, pageId = -1, extra = null, quantity = 1, isPurchaseAllowed = true, beforePurchase = null, ...rest } = props;
    const [ purchaseState, setPurchaseState ] = useState(CatalogPurchaseState.NONE);
    const [ pendingApproval, setPendingApproval ] = useState(false);

    const onCatalogEvent = useCallback((event: CatalogEvent) =>
    {
        switch(event.type)
        {
            case CatalogEvent.PURCHASE_SUCCESS:
                setPurchaseState(CatalogPurchaseState.NONE);
                return;
            case CatalogEvent.SOLD_OUT:
                setPurchaseState(CatalogPurchaseState.SOLD_OUT);
                return;
            case CatalogEvent.PURCHASE_FAILED:
                setPurchaseState(CatalogPurchaseState.FAILED);
                return;
        }
    }, []);

    useUiEvent(CatalogEvent.PURCHASE_SUCCESS, onCatalogEvent);
    useUiEvent(CatalogEvent.SOLD_OUT, onCatalogEvent);
    useUiEvent(CatalogEvent.PURCHASE_FAILED, onCatalogEvent);

    const purchase = useCallback(() =>
    {
        SendMessageHook(new PurchaseFromCatalogComposer(pageId, offer.offerId, extra, quantity));
    }, [ pageId, offer, extra, quantity ]);

    const attemptPurchase = useCallback(() =>
    {
        setPurchaseState(CatalogPurchaseState.PURCHASE);

        if(beforePurchase) beforePurchase();

        if(!isPurchaseAllowed)
        {
            BatchUpdates(() =>
            {
                setPendingApproval(true);
                setPurchaseState(CatalogPurchaseState.NONE);
            });

            return;
        }

        purchase();
    }, [ isPurchaseAllowed, beforePurchase, purchase ]);

    useEffect(() =>
    {
        setPurchaseState(CatalogPurchaseState.NONE);
    }, [ offer, quantity ]);

    useEffect(() =>
    {
        if(pendingApproval && isPurchaseAllowed)
        {
            setPendingApproval(false);
            
            purchase();

            return;
        }
    }, [ purchaseState, pendingApproval, isPurchaseAllowed, purchase ]);

    const product = offer.products[0];

    if(product && product.uniqueLimitedItem && !product.uniqueLimitedItemsLeft)
    {
        return <Button variant="danger" size="sm" disabled>{ LocalizeText('catalog.alert.limited_edition_sold_out.title') }</Button>;
    }

    if((offer.priceCredits * quantity) > GetCurrencyAmount(-1))
    {
        return <Button variant="danger" size="sm" disabled>{ LocalizeText('catalog.alert.notenough.title') }</Button>;
    }

    if((offer.priceActivityPoints * quantity) > GetCurrencyAmount(offer.priceActivityPointsType))
    {
        return <Button variant="danger" size="sm" disabled>{ LocalizeText('catalog.alert.notenough.activitypoints.title.' + offer.priceActivityPointsType) }</Button>;
    }

    switch(purchaseState)
    {
        case CatalogPurchaseState.CONFIRM:
            return <Button variant="warning" size="sm" onClick={ attemptPurchase } { ...rest }>{ LocalizeText('catalog.marketplace.confirm_title') }</Button>;
        case CatalogPurchaseState.PURCHASE:
            return <Button variant="primary" size="sm" disabled { ...rest }><LoadingSpinnerView /></Button>;
        case CatalogPurchaseState.SOLD_OUT:
            return <Button variant="danger" size="sm" disabled { ...rest }>{ LocalizeText('generic.failed') + ' - ' + LocalizeText('catalog.alert.limited_edition_sold_out.title') }</Button>;
        case CatalogPurchaseState.FAILED:
            return <Button variant="danger" size="sm" disabled { ...rest }>{ LocalizeText('generic.failed') }</Button>;
        case CatalogPurchaseState.NONE:
        default:
            return <Button variant="success" size="sm" onClick={ event => setPurchaseState(CatalogPurchaseState.CONFIRM) }>{ LocalizeText('buy') }</Button>
    }
}
