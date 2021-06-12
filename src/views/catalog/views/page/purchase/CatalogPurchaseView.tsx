import { FC, useEffect, useState } from 'react';
import { LocalizeText } from '../../../../../utils/LocalizeText';
import { CurrencyIcon } from '../../../../currency-icon/CurrencyIcon';
import { CatalogPurchaseViewProps } from './CatalogPurchaseView.types';
import { CatalogPurchaseButtonView } from './purchase-button/CatalogPurchaseButtonView';

export const CatalogPurchaseView: FC<CatalogPurchaseViewProps> = props =>
{
    const { offer = null, pageId = -1, extra = '' } = props;
    const [ quantity, setQuantity ] = useState(1);

    useEffect(() =>
    {
        setQuantity(1);
    }, [ offer ]);

    function increaseQuantity(): void
    {
        let newQuantity = quantity + 1;

        if(newQuantity > 99) newQuantity = 99

        setQuantity(newQuantity);
    }

    function decreaseQuantity(): void
    {
        let newQuantity = quantity - 1;

        if(newQuantity <= 0) newQuantity = 1;

        setQuantity(newQuantity);
    }

    function updateQuantity(amount: number): void
    {
        if(isNaN(amount) || (amount <= 0)) amount = 1;

        if(amount > 99) amount = 99;

        setQuantity(amount);
    }

    const extraData = ((extra && extra.length) ? extra : (offer?.products[0]?.extraParam || null));
    
    return (
        <div className="d-flex flex-column flex-grow-1 justify-content-end w-100">
            <div className="d-flex align-items-end">
                <div className="flex-grow-1 align-items-end">
                    <span className="text-black">{ LocalizeText('catalog.bundlewidget.price') }</span>
                    { offer.bundlePurchaseAllowed &&
                        <div className="d-flex align-items-center">
                            <i className="fas fa-caret-left cursor-pointer me-1 text-black" onClick={ decreaseQuantity } />
                            <input type="number" className="form-control form-control-sm quantity-input" value={ quantity } onChange={ event => updateQuantity(event.target.valueAsNumber)} />
                            <i className="fas fa-caret-right cursor-pointer ms-1 text-black" onClick={ increaseQuantity } />
                        </div> }
                </div>
                <div className="d-flex flex-column">
                    { (offer.priceCredits > 0) &&
                        <div className="d-flex align-items-center justify-content-end">
                            <span className="text-black ms-1">{ offer.priceCredits * quantity }</span>
                            <CurrencyIcon type={ -1 } />
                        </div> }
                    { (offer.priceActivityPoints > 0) &&
                        <div className="d-flex align-items-center justify-content-end">
                            <span className="text-black ms-1">{ offer.priceActivityPoints * quantity }</span>
                            <CurrencyIcon type={ offer.priceActivityPointsType } />
                        </div> }
                </div>
            </div>
            <div className="d-flex flex-column mt-1">
                <CatalogPurchaseButtonView className="btn-sm w-100" offer={ offer } pageId={ pageId } extra={ extraData } quantity={ quantity } />
                { offer.giftable && <button type="button" className="btn btn-secondary btn-sm w-100 mt-1">{ LocalizeText('catalog.purchase_confirmation.gift') }</button> }
            </div>
        </div>
    );
}
