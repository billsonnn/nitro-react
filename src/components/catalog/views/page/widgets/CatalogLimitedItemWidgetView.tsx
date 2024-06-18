import { FC } from 'react';
import { Offer } from '../../../../../api';
import { LayoutLimitedEditionCompletePlateView } from '../../../../../common';
import { useCatalog } from '../../../../../hooks';

export const CatalogLimitedItemWidgetView: FC = props =>
{
    const { currentOffer = null } = useCatalog();

    if(!currentOffer || (currentOffer.pricingModel !== Offer.PRICING_MODEL_SINGLE) || !currentOffer.product.isUniqueLimitedItem) return null;

    return (
        <div className="w-full">
            <LayoutLimitedEditionCompletePlateView className="mx-auto" uniqueLimitedItemsLeft={ currentOffer.product.uniqueLimitedItemsLeft } uniqueLimitedSeriesSize={ currentOffer.product.uniqueLimitedItemSeriesSize } />
        </div>
    );
};
