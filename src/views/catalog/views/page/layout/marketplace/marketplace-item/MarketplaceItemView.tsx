import { FC, useCallback } from 'react';
import { GetRoomEngine, LocalizeText } from '../../../../../../../api';
import { NitroCardGridItemView } from '../../../../../../../layout';
import { MarketplaceOfferData } from '../common/MarketplaceOfferData';

export const OWN_OFFER = 1;
export const OTHER_OFFER = 2;

export interface MarketplaceItemViewProps
{
    offerData: MarketplaceOfferData;
    type?: number;
}

export const MarketplaceItemView: FC<MarketplaceItemViewProps> = props =>
{
    const { offerData = null, type = OTHER_OFFER } = props;

    const getImageUrlForOffer = useCallback( () =>
    {
        if(!offerData) return '';

        switch(offerData.furniType)
        {
            case 1:
                return GetRoomEngine().getFurnitureFloorIconUrl(offerData.furniId);
            case 2:
                return GetRoomEngine().getFurnitureWallIconUrl(offerData.furniId, offerData.extraData);
        }

        return '';
    }, [offerData]);
    
    const getMarketplaceOfferTitle = useCallback(() =>
    {
        if(!offerData) return '';

        const localizationKey = offerData.furniType === 2  ? 'wallItem.name.' + offerData.furniId: 'roomItem.name.' + offerData.furniId;

        return LocalizeText(localizationKey);
    }, [offerData]);

    const getMarketplaceOfferDescription = useCallback( () =>
    {
        if(!offerData) return '';

        const localizationKey =  offerData.furniType === 2 ? 'wallItem.desc.' + offerData.furniId : 'roomItem.desc.' + offerData.furniId;

        return LocalizeText(localizationKey);
    }, [offerData]);

    const offerTime = useCallback( () =>
    {
        if(!offerData) return '';

        const time = Math.max(1, offerData.timeLeftMinutes);
        const hours = Math.floor(time / 60);
        const minutes =  time - (hours * 60);

        let text = minutes + ' ' + LocalizeText('catalog.marketplace.offer.minutes');
        if(hours > 0)
        {
            text = hours + ' ' + LocalizeText('catalog.marketplace.offer.hours') + ' ' + text;
        }

        return LocalizeText('catalog.marketplace.offer.time_left', ['time'], [text] );
    }, [offerData]);

    return (
    <NitroCardGridItemView className='w-100 marketplace-item'>
        <img src={ getImageUrlForOffer() } className='mx-3'/>
        <div className='h-100 flex-grow-1 lh-1'>
            <div className='fw-bold'>{getMarketplaceOfferTitle()}</div>
            <div className='fst-italic fs-6'>{getMarketplaceOfferDescription()}</div>
            
            { type === OWN_OFFER && <>
                <div>{ LocalizeText('catalog.marketplace.offer.price_own_item', ['price'], [offerData.price.toString()])}</div>
                <div>{ offerTime() }</div>
            </>
            }
            { type === OTHER_OFFER && <>
                <div>{ LocalizeText('catalog.marketplace.offer.price_public_item', ['price', 'average'], [offerData.price.toString(), offerData.averagePrice.toString() ]) }</div>
                <div>{ LocalizeText('catalog.marketplace.offer_count', ['count'], [offerData.offerCount.toString()]) }</div>
            </>
            }
        </div>
        <div className='btn-group-vertical mx-1'>
            { type === OWN_OFFER && <button className='btn btn-secondary btn-sm'>{LocalizeText('catalog.marketplace.offer.pick')}</button>}
        </div>
    </NitroCardGridItemView>)
}
