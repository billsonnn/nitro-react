import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FC } from 'react';
import { Flex } from '../../../../../common/Flex';
import { Text } from '../../../../../common/Text';
import { CurrencyIcon } from '../../../../../views/shared/currency-icon/CurrencyIcon';
import { IPurchasableOffer } from '../../../common/IPurchasableOffer';

interface CatalogPriceDisplayWidgetViewProps
{
    offer: IPurchasableOffer;
}

export const CatalogPriceDisplayWidgetView: FC<CatalogPriceDisplayWidgetViewProps> = props =>
{
    const { offer = null } = props;

    if(!offer) return null;

    return (
        <Flex gap={ 1 } className="bg-muted p-1 rounded">
            { (offer.priceInCredits > 0) &&
                <Flex alignItems="center" justifyContent="end" gap={ 1 }>
                    <Text>{ offer.priceInCredits }</Text>
                    <CurrencyIcon type={ -1 } />
                </Flex> }
            { ( offer.priceInCredits > 0) && (offer.priceInActivityPoints > 0) &&
                <FontAwesomeIcon icon="plus" /> }
            { (offer.priceInActivityPoints > 0) &&
                <Flex alignItems="center" justifyContent="end" gap={ 1 }>
                    <Text>{ offer.priceInActivityPoints }</Text>
                    <CurrencyIcon type={ offer.activityPointType } />
                </Flex> }
        </Flex>
    );
}
