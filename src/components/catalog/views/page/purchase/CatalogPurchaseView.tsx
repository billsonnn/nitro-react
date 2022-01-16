import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FC, useEffect, useState } from 'react';
import { LocalizeText } from '../../../../../api';
import { Column } from '../../../../../common/Column';
import { Flex } from '../../../../../common/Flex';
import { Text } from '../../../../../common/Text';
import { CurrencyIcon } from '../../../../../views/shared/currency-icon/CurrencyIcon';
import { IPurchasableOffer } from '../../../common/IPurchasableOffer';
import { Offer } from '../../../common/Offer';
import { CatalogPurchaseButtonView } from './CatalogPurchaseButtonView';
import { CatalogPurchaseGiftButtonView } from './CatalogPurchaseGiftButtonView';

export interface CatalogPurchaseViewProps
{
    offer: IPurchasableOffer;
    pageId: number;
    extra?: string;
    disabled?: boolean;
}

export const CatalogPurchaseView: FC<CatalogPurchaseViewProps> = props =>
{
    const { offer = null, pageId = -1, extra = '', disabled = false } = props;
    const [ quantity, setQuantity ] = useState(1);

    const increaseQuantity = () =>
    {
        let newQuantity = quantity + 1;

        if(newQuantity > 99) newQuantity = 99

        setQuantity(newQuantity);
    }

    const decreaseQuantity = () =>
    {
        let newQuantity = quantity - 1;

        if(newQuantity <= 0) newQuantity = 1;

        setQuantity(newQuantity);
    }

    const updateQuantity = (amount: number) =>
    {
        if(isNaN(amount) || (amount <= 0)) amount = 1;

        if(amount > 99) amount = 99;

        setQuantity(amount);
    }

    useEffect(() =>
    {
        setQuantity(1);
    }, [ offer ]);

    const extraData = ((extra && extra.length) ? extra : (offer.product.extraParam || null));
    
    return (
        <Column fullWidth grow justifyContent="end">
            <Flex alignItems="end">
                <div className="flex-grow-1 align-items-end">
                    <Text>{ LocalizeText('catalog.bundlewidget.price') }</Text>
                    { offer.bundlePurchaseAllowed &&
                        <Flex alignItems="center" gap={ 1 }>
                            <FontAwesomeIcon icon="caret-left" className="text-black cursor-pointer" onClick={ decreaseQuantity } />
                            <input type="number" className="form-control form-control-sm quantity-input" value={ quantity } onChange={ event => updateQuantity(event.target.valueAsNumber)} />
                            <FontAwesomeIcon icon="caret-right" className="text-black cursor-pointer" onClick={ increaseQuantity } />
                        </Flex> }
                </div>
                <Column gap={ 1 }>
                    { ((offer.priceType === Offer.PRICE_TYPE_CREDITS_ACTIVITYPOINTS) || (offer.priceType === Offer.PRICE_TYPE_CREDITS)) &&
                        <Flex alignItems="center" justifyContent="end" gap={ 1 }>
                            <Text>{ offer.priceInCredits * quantity }</Text>
                            <CurrencyIcon type={ -1 } />
                        </Flex> }
                    { ((offer.priceType === Offer.PRICE_TYPE_CREDITS_ACTIVITYPOINTS) || (offer.priceType === Offer.PRICE_TYPE_ACTIVITYPOINTS)) &&
                        <Flex alignItems="center" justifyContent="end" gap={ 1 }>
                            <Text>{ offer.priceInActivityPoints * quantity }</Text>
                            <CurrencyIcon type={ offer.activityPointType } />
                        </Flex> }
                </Column>
            </Flex>
            <Column gap={ 1 }>
                <CatalogPurchaseButtonView offer={ offer } pageId={ pageId } extra={ extraData } quantity={ quantity } disabled={ disabled } />
                { offer.giftable &&
                    <CatalogPurchaseGiftButtonView offer={ offer } pageId={ pageId } extra={ extraData } disabled={ disabled } /> }
            </Column>
        </Column>
    );
}
