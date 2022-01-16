import { FC } from 'react';
import { LocalizeText } from '../../../../../api';
import { Button, ButtonProps } from '../../../../../common/Button';
import { CatalogInitGiftEvent } from '../../../../../events/catalog/CatalogInitGiftEvent';
import { dispatchUiEvent } from '../../../../../hooks';
import { IPurchasableOffer } from '../../../common/IPurchasableOffer';

export interface CatalogPurchaseGiftButtonViewProps extends ButtonProps
{
    offer: IPurchasableOffer;
    pageId: number;
    extra?: string;
}

export const CatalogPurchaseGiftButtonView: FC<CatalogPurchaseGiftButtonViewProps> = props =>
{
    const { offer = null, pageId = -1, extra = null, ...rest } = props;
    
    const initGift = () =>
    {
        dispatchUiEvent(new CatalogInitGiftEvent(pageId, offer.offerId, extra));
    }

    return <Button variant="secondary" size="sm" onClick={ initGift } { ...rest }>{ LocalizeText('catalog.purchase_confirmation.gift') }</Button>;
}
