import { FC, useCallback } from 'react';
import { LocalizeText } from '../../../../../../api';
import { CatalogInitGiftEvent } from '../../../../../../events/catalog/CatalogInitGiftEvent';
import { dispatchUiEvent } from '../../../../../../hooks';
import { CatalogPurchaseGiftButtonViewProps } from './CatalogPurchaseGiftButtonView.types';

export const CatalogPurchaseGiftButtonView: FC<CatalogPurchaseGiftButtonViewProps> = props =>
{
    const { className = '', offer = null, pageId = -1, extra = null, quantity = 1, isPurchaseAllowed = true, beforePurchase = null } = props;
    
    const initGift = useCallback(() =>
    {
        dispatchUiEvent(new CatalogInitGiftEvent(pageId, offer.offerId, extra));
    }, [ extra, offer, pageId ]);

    return (
        <button type="button" className={ 'btn btn-secondary ' + className } onClick={ initGift }>{ LocalizeText('catalog.purchase_confirmation.gift') }</button>
    );
}
