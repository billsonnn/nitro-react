import { FC } from 'react';
import { FaPlus } from 'react-icons/fa';
import { IPurchasableOffer } from '../../../../../api';
import { Flex, LayoutCurrencyIcon, Text } from '../../../../../common';
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
                <Flex alignItems="center" gap={ 1 }>
                    <Text bold>{ (offer.priceInCredits * quantity) }</Text>
                    <LayoutCurrencyIcon type={ -1 } />
                </Flex> }
            { separator && (offer.priceInCredits > 0) && (offer.priceInActivityPoints > 0) &&
                <FaPlus size="xs" color="black" className="fa-icon" /> }
            { (offer.priceInActivityPoints > 0) &&
                <Flex alignItems="center" gap={ 1 }>
                    <Text bold>{ (offer.priceInActivityPoints * quantity) }</Text>
                    <LayoutCurrencyIcon type={ offer.activityPointType } />
                </Flex> }
        </>
    );
}
