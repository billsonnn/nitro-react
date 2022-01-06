import { FC, useCallback } from 'react';
import { GetRoomEngine, LocalizeText } from '../../../../../../../api';
import { NitroCardGridItemView } from '../../../../../../../layout';
import { MarketplaceOfferData } from '../common/MarketplaceOfferData';
import { MarketPlaceOfferState } from '../common/MarketplaceOfferState';

export const OWN_OFFER = 1;
export const PUBLIC_OFFER = 2;

export interface MarketplaceItemViewProps
{
    offerData: MarketplaceOfferData;
    type?: number;
    onClick(offerData: MarketplaceOfferData): void;
}

export const MarketplaceItemView: FC<MarketplaceItemViewProps> = props =>
{
    const { offerData = null, type = PUBLIC_OFFER, onClick = null } = props;

    const getImageUrlForOffer = useCallback( () =>
    {
        if(!offerData) return '';

        switch(offerData.furniType)
        {
            case MarketplaceOfferData.TYPE_FLOOR:
                return GetRoomEngine().getFurnitureFloorIconUrl(offerData.furniId);
            case MarketplaceOfferData.TYPE_WALL:
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

        if(offerData.status === MarketPlaceOfferState.SOLD) return LocalizeText('catalog.marketplace.offer.sold');

        if(offerData.timeLeftMinutes <= 0) return LocalizeText('catalog.marketplace.offer.expired');
        
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
    <NitroCardGridItemView className='w-100 marketplace-item align-items-center'>
        <img src={ getImageUrlForOffer() } className='mx-3' alt='' />
        <div className='h-100 flex-grow-1 justify-content-center '>
            <div className='fw-bold'>{getMarketplaceOfferTitle()}</div>
            <div className='fst-italic fs-6'>{getMarketplaceOfferDescription()}</div>
            
            { type === OWN_OFFER && <>
                <div>{ LocalizeText('catalog.marketplace.offer.price_own_item', ['price'], [offerData.price.toString()])}</div>
                <div>{ offerTime() }</div>
            </>
            }
            { type === PUBLIC_OFFER && <>
                <div>{ LocalizeText('catalog.marketplace.offer.price_public_item', ['price', 'average'], [offerData.price.toString(), offerData.averagePrice.toString() ]) }</div>
                <div>{ LocalizeText('catalog.marketplace.offer_count', ['count'], [offerData.offerCount.toString()]) }</div>
            </>
            }
        </div>
        <div className='btn-group-vertical mx-1 gap-2'>
            { (type === OWN_OFFER && offerData.status !== MarketPlaceOfferState.SOLD) && <button className='btn btn-secondary btn-sm' onClick={ () => onClick(offerData) }>{ LocalizeText('catalog.marketplace.offer.pick') }</button>}
            { type === PUBLIC_OFFER && <>
                <button className='btn btn-secondary btn-sm' onClick={ () => onClick(offerData) } >{ LocalizeText('buy') }</button>
                <button className='btn btn-secondary btn-sm' disabled={true}>{ LocalizeText('catalog.marketplace.view_more') }</button>
            </>}
        </div>
    </NitroCardGridItemView>)
}
