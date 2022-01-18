import { FC, useMemo } from 'react';
import { LayoutGridItem, LayoutGridItemProps } from '../../../../../common/layout/LayoutGridItem';
import { IPurchasableOffer } from '../../../common/IPurchasableOffer';
import { Offer } from '../../../common/Offer';

interface CatalogGridOfferViewProps extends LayoutGridItemProps
{
    offer: IPurchasableOffer;
}

export const CatalogGridOfferView: FC<CatalogGridOfferViewProps> = props =>
{
    const { offer = null, ...rest } = props;

    const iconUrl = useMemo(() =>
    {
        if(offer.pricingModel === Offer.PRICING_MODEL_BUNDLE)
        {
            return null;
        }

        return offer.product.getIconUrl(offer);
    }, [ offer ]);

    return <LayoutGridItem itemImage={ iconUrl } itemCount={ (offer.pricingModel === Offer.PRICING_MODEL_MULTI) ? offer.product.productCount : 1 } { ...rest } />;
}
