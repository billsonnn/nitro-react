import { FC } from 'react';
import { LocalizeText } from '../../../../../../utils/LocalizeText';
import { CatalogPurchaseGiftButtonViewProps } from './CatalogPurchaseGiftButtonView.types';

export const CatalogPurchaseGiftButtonView: FC<CatalogPurchaseGiftButtonViewProps> = props =>
{
    const { className = '', offer = null, pageId = -1, extra = null, quantity = 1, isPurchaseAllowed = true, beforePurchase = null } = props;
    
    return (
        <button type="button" className={ 'btn btn-secondary ' + className }>{ LocalizeText('catalog.purchase_confirmation.gift') }</button>
    );
}
