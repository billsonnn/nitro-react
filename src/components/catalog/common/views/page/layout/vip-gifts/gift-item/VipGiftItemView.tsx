import { CatalogPageMessageOfferData } from '@nitrots/nitro-renderer';
import { FC, useCallback } from 'react';
import { LocalizeText } from '../../../../../../../api';
import { NitroCardGridItemView } from '../../../../../../../layout';
import { ProductImageUtility } from '../../../../../../notification-center/common/ProductImageUtility';

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
        <NitroCardGridItemView className='w-100 vip-gift-item align-items-center'>
            <img src={ getImageUrlForOffer() } className='mx-3' alt='' />
            <div className='h-100 flex-grow-1 justify-content-center '>
                <div className='fw-bold'>{getItemTitle()}</div>
                <div className='fst-italic fs-6'>{getItemDesc()}</div>
            </div>
            <div className='btn-group-vertical mx-1 gap-2'>
                <button className='btn btn-secondary btn-sm' disabled={!isAvailable} onClick={() => onSelect(offer.localizationId)}>{ LocalizeText('catalog.club_gift.select') }</button>
            </div>
        </NitroCardGridItemView>
    )
}
