import { CatalogPageMessageOfferData } from '@nitrots/nitro-renderer';
import { FC, useCallback } from 'react';
import { LocalizeText, ProductImageUtility } from '../../../../../../api';
import { Button, LayoutGridItem, LayoutImage, Text } from '../../../../../../common';

export interface VipGiftItemViewProps
{
    offer: CatalogPageMessageOfferData;
    isAvailable: boolean;
    daysRequired: number;
    onSelect(localizationId: string): void;
}

export const VipGiftItem : FC<VipGiftItemViewProps> = props =>
{
    const { offer = null, isAvailable = false, daysRequired = 0, onSelect = null } = props;
    
    const getImageUrlForOffer = useCallback( () =>
    {
        if(!offer || !offer.products.length) return '';

        const productData = offer.products[0];

        return ProductImageUtility.getProductImageUrl(productData.productType, productData.furniClassId, productData.extraParam);
    }, [ offer ]);
    
    const getItemTitle = useCallback(() =>
    {
        if(!offer || !offer.products.length) return '';

        const productData = offer.products[0];

        const localizationKey = ProductImageUtility.getProductCategory(productData.productType, productData.furniClassId) === 2 ? 'wallItem.name.' + productData.furniClassId : 'roomItem.name.' + productData.furniClassId;

        return LocalizeText(localizationKey);
    }, [ offer ]);

    const getItemDesc = useCallback( () =>
    {
        if(!offer || !offer.products.length) return '';

        const productData = offer.products[0];

        const localizationKey = ProductImageUtility.getProductCategory(productData.productType, productData.furniClassId) === 2 ? 'wallItem.desc.' + productData.furniClassId : 'roomItem.desc.' + productData.furniClassId ;

        return LocalizeText(localizationKey);
    }, [ offer ]);

    const getMonthsRequired = useCallback(() => 
    {
        return Math.floor(daysRequired / 31);
    },[ daysRequired ]);

    return (
        <LayoutGridItem center={ false } column={ false } alignItems="center" className="p-1">
            <LayoutImage imageUrl={ getImageUrlForOffer() } />
            <Text grow fontWeight="bold">{ getItemTitle() }</Text>
            <Button variant="secondary" onClick={ () => onSelect(offer.localizationId) } disabled={ !isAvailable }>
                { LocalizeText('catalog.club_gift.select') }
            </Button>
        </LayoutGridItem>
    );
}
