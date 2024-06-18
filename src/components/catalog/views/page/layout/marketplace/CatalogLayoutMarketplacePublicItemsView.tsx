import { BuyMarketplaceOfferMessageComposer, GetMarketplaceOffersMessageComposer, MarketplaceBuyOfferResultEvent, MarketPlaceOffersEvent } from '@nitrots/nitro-renderer';
import { FC, useCallback, useMemo, useState } from 'react';
import { IMarketplaceSearchOptions, LocalizeText, MarketplaceOfferData, MarketplaceSearchType, NotificationAlertType, SendMessageComposer } from '../../../../../../api';
import { Button, Column, Text } from '../../../../../../common';
import { useMessageEvent, useNotification, usePurse } from '../../../../../../hooks';
import { CatalogLayoutProps } from '../CatalogLayout.types';
import { CatalogLayoutMarketplaceItemView, PUBLIC_OFFER } from './CatalogLayoutMarketplaceItemView';
import { SearchFormView } from './CatalogLayoutMarketplaceSearchFormView';

const SORT_TYPES_VALUE = [ 1, 2 ];
const SORT_TYPES_ACTIVITY = [ 3, 4, 5, 6 ];
const SORT_TYPES_ADVANCED = [ 1, 2, 3, 4, 5, 6 ];
export interface CatalogLayoutMarketplacePublicItemsViewProps extends CatalogLayoutProps
{

}

export const CatalogLayoutMarketplacePublicItemsView: FC<CatalogLayoutMarketplacePublicItemsViewProps> = props =>
{
    const [ searchType, setSearchType ] = useState(MarketplaceSearchType.BY_ACTIVITY);
    const [ totalItemsFound, setTotalItemsFound ] = useState(0);
    const [ offers, setOffers ] = useState(new Map<number, MarketplaceOfferData>());
    const [ lastSearch, setLastSearch ] = useState<IMarketplaceSearchOptions>({ minPrice: -1, maxPrice: -1, query: '', type: 3 });
    const { getCurrencyAmount = null } = usePurse();
    const { simpleAlert = null, showConfirm = null } = useNotification();

    const requestOffers = useCallback((options: IMarketplaceSearchOptions) =>
    {
        setLastSearch(options);
        SendMessageComposer(new GetMarketplaceOffersMessageComposer(options.minPrice, options.maxPrice, options.query, options.type));
    }, []);

    const getSortTypes = useMemo(() =>
    {
        switch(searchType)
        {
            case MarketplaceSearchType.BY_ACTIVITY:
                return SORT_TYPES_ACTIVITY;
            case MarketplaceSearchType.BY_VALUE:
                return SORT_TYPES_VALUE;
            case MarketplaceSearchType.ADVANCED:
                return SORT_TYPES_ADVANCED;
        }
        return [];
    }, [ searchType ]);

    const purchaseItem = useCallback((offerData: MarketplaceOfferData) =>
    {
        if(offerData.price > getCurrencyAmount(-1))
        {
            simpleAlert(LocalizeText('catalog.alert.notenough.credits.description'), NotificationAlertType.DEFAULT, null, null, LocalizeText('catalog.alert.notenough.title'));
            return;
        }

        const offerId = offerData.offerId;

        showConfirm(LocalizeText('catalog.marketplace.confirm_header'), () =>
        {
            SendMessageComposer(new BuyMarketplaceOfferMessageComposer(offerId));
        },
        null, null, null, LocalizeText('catalog.marketplace.confirm_title'));
    }, [ getCurrencyAmount, simpleAlert, showConfirm ]);

    useMessageEvent<MarketPlaceOffersEvent>(MarketPlaceOffersEvent, event =>
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

        setTotalItemsFound(parser.totalItemsFound);
        setOffers(latestOffers);
    });

    useMessageEvent<MarketplaceBuyOfferResultEvent>(MarketplaceBuyOfferResultEvent, event =>
    {
        const parser = event.getParser();

        if(!parser) return;

        switch(parser.result)
        {
            case 1:
                requestOffers(lastSearch);
                break;
            case 2:
                setOffers(prev =>
                {
                    const newVal = new Map(prev);
                    newVal.delete(parser.requestedOfferId);
                    return newVal;
                });
                simpleAlert(LocalizeText('catalog.marketplace.not_available_header'), NotificationAlertType.DEFAULT, null, null, LocalizeText('catalog.marketplace.not_available_title'));
                break;
            case 3:
                // our shit was updated
                // todo: some dialogue modal 
                setOffers(prev =>
                {
                    const newVal = new Map(prev);

                    const item = newVal.get(parser.requestedOfferId);
                    if(item)
                    {
                        item.offerId = parser.offerId;
                        item.price = parser.newPrice;
                        item.offerCount--;
                        newVal.set(item.offerId, item);
                    }

                    newVal.delete(parser.requestedOfferId);
                    return newVal;
                });

                showConfirm(LocalizeText('catalog.marketplace.confirm_higher_header') +
                    '\n' + LocalizeText('catalog.marketplace.confirm_price', [ 'price' ], [ parser.newPrice.toString() ]), () =>
                {
                    SendMessageComposer(new BuyMarketplaceOfferMessageComposer(parser.offerId));
                },
                null, null, null, LocalizeText('catalog.marketplace.confirm_higher_title'));
                break;
            case 4:
                simpleAlert(LocalizeText('catalog.alert.notenough.credits.description'), NotificationAlertType.DEFAULT, null, null, LocalizeText('catalog.alert.notenough.title'));
                break;
        }
    });

    return (
        <>
            <div className="relative inline-flex align-middle">
                <Button active={ (searchType === MarketplaceSearchType.BY_ACTIVITY) } onClick={ () => setSearchType(MarketplaceSearchType.BY_ACTIVITY) }>
                    { LocalizeText('catalog.marketplace.search_by_activity') }
                </Button>
                <Button active={ (searchType === MarketplaceSearchType.BY_VALUE) } onClick={ () => setSearchType(MarketplaceSearchType.BY_VALUE) }>
                    { LocalizeText('catalog.marketplace.search_by_value') }
                </Button>
                <Button active={ (searchType === MarketplaceSearchType.ADVANCED) } onClick={ () => setSearchType(MarketplaceSearchType.ADVANCED) }>
                    { LocalizeText('catalog.marketplace.search_advanced') }
                </Button>
            </div>
            <SearchFormView searchType={ searchType } sortTypes={ getSortTypes } onSearch={ requestOffers } />
            <Column gap={ 1 } overflow="hidden">
                <Text shrink truncate fontWeight="bold">
                    { LocalizeText('catalog.marketplace.items_found', [ 'count' ], [ offers.size.toString() ]) }
                </Text>
                <Column className="nitro-catalog-layout-marketplace-grid" overflow="auto">
                    {
                        Array.from(offers.values()).map((entry, index) => <CatalogLayoutMarketplaceItemView key={ index } offerData={ entry } type={ PUBLIC_OFFER } onClick={ purchaseItem } />)
                    }
                </Column>
            </Column>
        </>
    );
};
