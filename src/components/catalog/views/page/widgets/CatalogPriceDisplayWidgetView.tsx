import { FC } from 'react';
import { FaPlus } from 'react-icons/fa';
import { IPurchasableOffer } from '../../../../../api';
import { LayoutCurrencyIcon, Text } from '../../../../../common';
import { useCatalog } from '../../../../../hooks';

interface CatalogPriceDisplayWidgetViewProps
{
    offer: IPurchasableOffer;
    separator?: boolean;
}

export const CatalogPriceDisplayWidgetView: FC<CatalogPriceDisplayWidgetViewProps> = props =>
{
    const { offer = null, separator = false } = props;
    const { purchaseOptions = null } = useCatalog();
    const { quantity = 1 } = purchaseOptions;

    if(!offer) return null;

    return (
        <>
            { (offer.priceInCredits > 0) &&
                <div className="flex items-center gap-1">
                    <Text bold>{ (offer.priceInCredits * quantity) }</Text>
                    <LayoutCurrencyIcon type={ -1 } />
                </div> }
            { separator && (offer.priceInCredits > 0) && (offer.priceInActivityPoints > 0) &&
                <FaPlus className="fa-icon" color="black" size="xs" /> }
            { (offer.priceInActivityPoints > 0) &&
                <div className="flex items-center gap-1">
                    <Text bold>{ (offer.priceInActivityPoints * quantity) }</Text>
                    <LayoutCurrencyIcon type={ offer.activityPointType } />
                </div> }
        </>
    );
};
