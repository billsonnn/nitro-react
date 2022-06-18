import { FC } from 'react';
import { Offer } from '../../../../../api';
import { Base, BaseProps, LayoutLimitedEditionCompletePlateView } from '../../../../../common';
import { useCatalog } from '../../../../../hooks';

export const CatalogLimitedItemWidgetView: FC<BaseProps<HTMLDivElement>> = props =>
{
    const { children = null, ...rest } = props;
    const { currentOffer = null } = useCatalog();

    if(!currentOffer || (currentOffer.pricingModel !== Offer.PRICING_MODEL_SINGLE) || !currentOffer.product.isUniqueLimitedItem) return null;
    
    return (
        <Base { ...rest }>
            <LayoutLimitedEditionCompletePlateView className="mx-auto" uniqueLimitedItemsLeft={ currentOffer.product.uniqueLimitedItemsLeft } uniqueLimitedSeriesSize={ currentOffer.product.uniqueLimitedItemSeriesSize } />
            { children }
        </Base>
    );
}
