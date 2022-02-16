import { CatalogPageMessageOfferData } from '@nitrots/nitro-renderer';
import { FC, useCallback } from 'react';
import { LocalizeText } from '../../../../../../api';
import { Button } from '../../../../../../common/Button';
import { LayoutGridItem } from '../../../../../../common/layout/LayoutGridItem';
import { LayoutImage } from '../../../../../../common/layout/LayoutImage';
import { Text } from '../../../../../../common/Text';
import { ProductImageUtility } from '../../../../../../views/notification-center/common/ProductImageUtility';

export interface VipGiftItemViewProps
{
    offer: CatalogPageMessageOfferData;
    isAvailable: boolean;
    onSelect(localizationId: string): void;
}

export const VipGiftItem : FC<VipGiftItemViewProps> = props =>
{
    const { offer = null, isAvailable = false, onSelect = null } = props;
    
    const getImageUrlForOffer = useCallback( () =>
    {
        if(!offer || !offer.products.length) return '';

        const productData = offer.products[0];

        return ProductImageUtility.getProductImageUrl(productData.productType, productData.furniClassId, productData.extraParam);
    }, [offer]);
    
    const getItemTitle = useCallback(() =>
    {
        if(!offer || !offer.products.length) return '';

        const productData = offer.products[0];

        const localizationKey = ProductImageUtility.getProductCategory(productData.productType, productData.furniClassId) === 2  ? 'wallItem.name.' + productData.furniClassId : 'roomItem.name.' + productData.furniClassId;

        return LocalizeText(localizationKey);
    }, [offer]);

    const getItemDesc = useCallback( () =>
    {
        if(!offer || !offer.products.length) return '';

        const productData = offer.products[0];

        const localizationKey = ProductImageUtility.getProductCategory(productData.productType, productData.furniClassId) === 2 ? 'wallItem.desc.' + productData.furniClassId : 'roomItem.desc.' + productData.furniClassId ;

        return LocalizeText(localizationKey);
    }, [offer]);

    return (
        <LayoutGridItem center={ false } column={ false } alignItems="center" className="p-1">
            <LayoutImage imageUrl={ getImageUrlForOffer() } fit={ false } style={ { width: 50, height: 50 } } />
            <Text grow fontWeight="bold">{ getItemTitle() }</Text>
            <Button variant="secondary" size="sm" onClick={ () => onSelect(offer.localizationId) }>
                { LocalizeText('catalog.club_gift.select') }
            </Button>
        </LayoutGridItem>
    );
}
