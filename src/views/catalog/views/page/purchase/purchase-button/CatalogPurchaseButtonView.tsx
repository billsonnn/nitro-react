import { PurchaseFromCatalogComposer } from '@nitrots/nitro-renderer';
import { FC, useCallback, useEffect, useState } from 'react';
import { LocalizeText } from '../../../../../../api';
import { CatalogEvent } from '../../../../../../events';
import { useUiEvent } from '../../../../../../hooks/events/ui/ui-event';
import { SendMessageHook } from '../../../../../../hooks/messages/message-event';
import { LoadingSpinnerView } from '../../../../../../layout';
import { GetCurrencyAmount } from '../../../../../purse/common/CurrencyHelper';
import { CatalogPurchaseButtonViewProps, CatalogPurchaseState } from './CatalogPurchaseButtonView.types';

export const CatalogPurchaseButtonView: FC<CatalogPurchaseButtonViewProps> = props =>
{
    const { className = '', offer = null, pageId = -1, extra = null, quantity = 1, isPurchaseAllowed = true, disabled = false, beforePurchase = null } = props;
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
        }
    }, []);

    useUiEvent(CatalogEvent.PURCHASE_SUCCESS, onCatalogEvent);
    useUiEvent(CatalogEvent.SOLD_OUT, onCatalogEvent);

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
            setPendingApproval(true);
            setPurchaseState(CatalogPurchaseState.NONE);

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
        return <button type="button" className={ 'btn btn-danger ' + className } disabled>{ LocalizeText('catalog.alert.limited_edition_sold_out.title') }</button>;
    }

    if((offer.priceCredits * quantity) > GetCurrencyAmount(-1))
    {
        return <button type="button" className={ 'btn btn-danger ' + className } disabled>{ LocalizeText('catalog.alert.notenough.title') }</button>;
    }

    if((offer.priceActivityPoints * quantity) > GetCurrencyAmount(offer.priceActivityPointsType))
    {
        return <button type="button" className={ 'btn btn-danger ' + className } disabled>{ LocalizeText('catalog.alert.notenough.activitypoints.title.' + offer.priceActivityPointsType) }</button>;
    }

    switch(purchaseState)
    {
        case CatalogPurchaseState.CONFIRM:
            return <button type="button" className={ 'btn btn-warning ' + className } onClick={ attemptPurchase }>{ LocalizeText('catalog.marketplace.confirm_title') }</button>;
        case CatalogPurchaseState.PURCHASE:
            return <button type="button" className={ 'btn btn-primary ' + className } disabled><LoadingSpinnerView /></button>;
        case CatalogPurchaseState.SOLD_OUT:
            return <button type="button" className={ 'btn btn-danger ' + className } disabled>{ LocalizeText('generic.failed') + ' - ' + LocalizeText('catalog.alert.limited_edition_sold_out.title') }</button>;
        case CatalogPurchaseState.NONE:
        default:
            return <button type="button" className={ 'btn btn-success ' + className } disabled={ disabled } onClick={ event => setPurchaseState(CatalogPurchaseState.CONFIRM) }>{ LocalizeText('buy') }</button>
    }
}
