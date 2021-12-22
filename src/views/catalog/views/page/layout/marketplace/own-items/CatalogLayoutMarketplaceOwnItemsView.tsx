import { GetMarketplaceOwnOffersMessageComposer, MarketplaceOwnOffersEvent } from '@nitrots/nitro-renderer';
import { FC, useCallback, useState } from 'react';
import { LocalizeText } from '../../../../../../../api';
import { BatchUpdates, CreateMessageHook, SendMessageHook, UseMountEffect } from '../../../../../../../hooks';
import { NitroCardGridView } from '../../../../../../../layout';
import { NitroLayoutBase } from '../../../../../../../layout/base';
import { CatalogLayoutProps } from '../../CatalogLayout.types';
import { MarketplaceOfferData } from '../common/MarketplaceOfferData';
import { MarketplaceItemView, OWN_OFFER } from '../marketplace-item/MarketplaceItemView';

export interface CatalogLayoutMarketplaceOwnItemsViewProps extends CatalogLayoutProps
{

}

export const CatalogLayoutMarketplaceOwnItemsView: FC<CatalogLayoutMarketplaceOwnItemsViewProps> = props =>
{
    const [ creditsWaiting, setCreditsWaiting ] = useState(0);
    const [ offers, setOffers ] = useState(new Map<number, MarketplaceOfferData>());

    UseMountEffect(() =>
    {
        SendMessageHook(new GetMarketplaceOwnOffersMessageComposer());
    });

    const onMarketPlaceOwnOffersEvent = useCallback((event: MarketplaceOwnOffersEvent) =>
    {
        const parser = event.getParser();

        if(!parser) return;

        const latestOffers = new Map<number, MarketplaceOfferData>();
        parser.offers.forEach(entry =>
        {
            const offerEntry = new MarketplaceOfferData(entry.offerId, entry.furniId, entry.furniType, entry.extraData, entry.stuffData, entry.price, entry.status, entry.averagePrice, entry.offerCount);
            offerEntry.timeLeftMinutes = entry.timeLeftMinutes;
            latestOffers.set(entry.offerId, offerEntry);
        });

        BatchUpdates(() =>
        {
            setCreditsWaiting(parser.creditsWaiting);
            setOffers(latestOffers);
        });
    }, []);

    CreateMessageHook(MarketplaceOwnOffersEvent, onMarketPlaceOwnOffersEvent);
    
    return (
    <>
        { (creditsWaiting <= 0) && <NitroLayoutBase className='text-black'>{LocalizeText('catalog.marketplace.redeem.no_sold_items')}</NitroLayoutBase>}

        { (creditsWaiting > 0) && <NitroLayoutBase className='text-black'>{LocalizeText('catalog.marketplace.redeem.get_credits', ['count', 'credits'], ['0', creditsWaiting.toString()])}</NitroLayoutBase>}

        <button className='btn btn-primary btn-sm mx-auto' disabled={creditsWaiting <= 0}>{LocalizeText('catalog.marketplace.offer.redeem')}</button>

        <div className='text-black'>{LocalizeText('catalog.marketplace.items_found', ['count'], [offers.size.toString()])}</div>
        <NitroCardGridView columns={1} className='text-black'>
            { 
                Array.from(offers.values()).map( (entry, index) => <MarketplaceItemView key={ index } offerData={ entry } type={ OWN_OFFER } />)
            }
        </NitroCardGridView>
    </>
    );
}
