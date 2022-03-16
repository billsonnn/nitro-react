import { CancelMarketplaceOfferMessageComposer, GetMarketplaceOwnOffersMessageComposer, MarketplaceCancelOfferResultEvent, MarketplaceOwnOffersEvent, RedeemMarketplaceOfferCreditsMessageComposer } from '@nitrots/nitro-renderer';
import { FC, useCallback, useMemo, useState } from 'react';
import { LocalizeText, NotificationAlertType, NotificationUtilities, SendMessageComposer } from '../../../../../../api';
import { Button, Column, Text } from '../../../../../../common';
import { BatchUpdates, UseMessageEventHook, UseMountEffect } from '../../../../../../hooks';
import { CatalogLayoutProps } from '../CatalogLayout.types';
import { CatalogLayoutMarketplaceItemView, OWN_OFFER } from './CatalogLayoutMarketplaceItemView';
import { MarketplaceOfferData } from './common/MarketplaceOfferData';
import { MarketPlaceOfferState } from './common/MarketplaceOfferState';

export const CatalogLayoutMarketplaceOwnItemsView: FC<CatalogLayoutProps> = props =>
{
    const [ creditsWaiting, setCreditsWaiting ] = useState(0);
    const [ offers, setOffers ] = useState<MarketplaceOfferData[]>([]);

    const onMarketPlaceOwnOffersEvent = useCallback((event: MarketplaceOwnOffersEvent) =>
    {
        const parser = event.getParser();

        if(!parser) return;

        const offers = parser.offers.map(offer =>
            {
                const newOffer = new MarketplaceOfferData(offer.offerId, offer.furniId, offer.furniType, offer.extraData, offer.stuffData, offer.price, offer.status, offer.averagePrice, offer.offerCount);

                newOffer.timeLeftMinutes = offer.timeLeftMinutes;

                return newOffer;
            });

        BatchUpdates(() =>
        {
            setCreditsWaiting(parser.creditsWaiting);
            setOffers(offers);
        });
    }, []);

    UseMessageEventHook(MarketplaceOwnOffersEvent, onMarketPlaceOwnOffersEvent);

    const onMarketplaceCancelOfferResultEvent = useCallback((event:MarketplaceCancelOfferResultEvent) =>
    {
        const parser = event.getParser();

        if(!parser) return;

        if(!parser.success)
        {
            NotificationUtilities.simpleAlert(LocalizeText('catalog.marketplace.cancel_failed'), NotificationAlertType.DEFAULT, null, null, LocalizeText('catalog.marketplace.operation_failed.topic'));

            return;
        }

        setOffers(prevValue => prevValue.filter(value => (value.offerId !== parser.offerId)));
    }, []);

    UseMessageEventHook(MarketplaceCancelOfferResultEvent, onMarketplaceCancelOfferResultEvent);

    const soldOffers = useMemo(() =>
    {
        return offers.filter(value => (value.status === MarketPlaceOfferState.SOLD));
    }, [ offers ]);
    
    const redeemSoldOffers = useCallback(() =>
    {
        setOffers(prevValue =>
        {
            const idsToDelete = soldOffers.map(value => value.offerId);

            return prevValue.filter(value => (idsToDelete.indexOf(value.offerId) === -1));
        })
        
        SendMessageComposer(new RedeemMarketplaceOfferCreditsMessageComposer());
    }, [ soldOffers ]);

    const takeItemBack = (offerData: MarketplaceOfferData) =>
    {
        SendMessageComposer(new CancelMarketplaceOfferMessageComposer(offerData.offerId));
    };

    UseMountEffect(() =>
    {
        SendMessageComposer(new GetMarketplaceOwnOffersMessageComposer());
    });

    return (
        <Column overflow="hidden">
            { (creditsWaiting <= 0) &&
                <Text center className="bg-muted rounded p-1">
                    { LocalizeText('catalog.marketplace.redeem.no_sold_items') }
                </Text> }
            { (creditsWaiting > 0) &&
                <Column center gap={ 1 } className="bg-muted rounded p-2">
                    <Text>
                        { LocalizeText('catalog.marketplace.redeem.get_credits', ['count', 'credits'], [ soldOffers.length.toString(), creditsWaiting.toString() ]) }
                    </Text>
                    <Button className="mt-1" onClick={ redeemSoldOffers }>
                        { LocalizeText('catalog.marketplace.offer.redeem') }
                    </Button>
                </Column> }
            <Column gap={ 1 } overflow="hidden">
                <Text truncate shrink fontWeight="bold">
                    { LocalizeText('catalog.marketplace.items_found', [ 'count' ], [ offers.length.toString() ]) }
                </Text>
                <Column overflow="auto" className="nitro-catalog-layout-marketplace-grid">
                    { (offers.length > 0) && offers.map(offer => <CatalogLayoutMarketplaceItemView key={ offer.offerId } offerData={ offer } type={ OWN_OFFER } onClick={ takeItemBack } />) }
                </Column>
            </Column>
        </Column>
    );
}
