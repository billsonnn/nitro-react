import { FC } from 'react';
import { Base, BaseProps } from '../../../../../common/Base';
import { LimitedEditionCompletePlateView } from '../../../../../views/shared/limited-edition/LimitedEditionCompletePlateView';
import { Offer } from '../../../common/Offer';
import { useCatalogContext } from '../../../context/CatalogContext';

export const CatalogLimitedItemWidgetView: FC<BaseProps<HTMLDivElement>> = props =>
{
    const { children = null, ...rest } = props;
    const { currentOffer = null } = useCatalogContext();

    if(!currentOffer || (currentOffer.pricingModel !== Offer.PRICING_MODEL_SINGLE) || !currentOffer.product.isUniqueLimitedItem) return null;
    
    return (
        <Base { ...rest }>
            <LimitedEditionCompletePlateView className="mx-auto" uniqueLimitedItemsLeft={ currentOffer.product.uniqueLimitedItemsLeft } uniqueLimitedSeriesSize={ currentOffer.product.uniqueLimitedItemSeriesSize } />
            { children }
        </Base>
    );
}
