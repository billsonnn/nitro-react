import { BuyMarketplaceOfferMessageComposer, GetMarketplaceOffersMessageComposer, MarketplaceBuyOfferResultEvent, MarketPlaceOffersEvent } from '@nitrots/nitro-renderer';
import { FC, useCallback, useMemo, useState } from 'react';
import { LocalizeText } from '../../../../../../../api';
import { BatchUpdates, CreateMessageHook, SendMessageHook } from '../../../../../../../hooks';
import { NitroCardGridView } from '../../../../../../../layout';
import { NotificationAlertType } from '../../../../../../notification-center/common/NotificationAlertType';
import { NotificationUtilities } from '../../../../../../notification-center/common/NotificationUtilities';
import { GetCurrencyAmount } from '../../../../../../purse/common/CurrencyHelper';
import { CatalogLayoutProps } from '../../CatalogLayout.types';
import { IMarketplaceSearchOptions } from '../common/IMarketplaceSearchOptions';
import { MarketplaceOfferData } from '../common/MarketplaceOfferData';
import { MarketplaceSearchType } from '../common/MarketplaceSearchType';
import { MarketplaceItemView, PUBLIC_OFFER } from '../marketplace-item/MarketplaceItemView';
import { SearchFormView } from './SearchFormView';

const SORT_TYPES_VALUE = [1, 2];
const SORT_TYPES_ACTIVITY = [3, 4, 5, 6];
const SORT_TYPES_ADVANCED = [1, 2, 3, 4, 5, 6];
export interface CatalogLayoutMarketplacePublicItemsViewProps extends CatalogLayoutProps
{

}

export const CatalogLayoutMarketplacePublicItemsView: FC<CatalogLayoutMarketplacePublicItemsViewProps> = props =>
{
    const [ searchType, setSearchType ] = useState(MarketplaceSearchType.BY_ACTIVITY);
    const [ totalItemsFound, setTotalItemsFound ] = useState(0);
    const [ offers, setOffers ] = useState(new Map<number, MarketplaceOfferData>());
    const [ lastSearch, setLastSearch ] = useState<IMarketplaceSearchOptions>({ minPrice: -1, maxPrice: -1, query: '', type: 3 });

    const requestOffers = useCallback((options: IMarketplaceSearchOptions) =>
    {
        setLastSearch(options);
        SendMessageHook(new GetMarketplaceOffersMessageComposer(options.minPrice, options.maxPrice, options.query, options.type))
    }, []);

    const getSortTypes = useMemo( () =>
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
    }, [searchType]);

    const purchaseItem = useCallback((offerData: MarketplaceOfferData) =>
    {
        if(offerData.price > GetCurrencyAmount(-1))
        {
            NotificationUtilities.simpleAlert(LocalizeText('catalog.alert.notenough.credits.description'), NotificationAlertType.DEFAULT, null, null, LocalizeText('catalog.alert.notenough.title'));
            return;
        }
        const offerId = offerData.offerId;
        NotificationUtilities.confirm(LocalizeText('catalog.marketplace.confirm_header'), () =>
            {
                SendMessageHook(new BuyMarketplaceOfferMessageComposer(offerId));
            },
            null, null, null, LocalizeText('catalog.marketplace.confirm_title'));
    },[]);

    const onMarketPlaceOffersEvent = useCallback( (event: MarketPlaceOffersEvent) =>
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
            setTotalItemsFound(parser.totalItemsFound);
            setOffers(latestOffers);
        });
        
    }, []);

    const onMarketplaceBuyOfferResultEvent = useCallback( (event: MarketplaceBuyOfferResultEvent) =>
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
                NotificationUtilities.simpleAlert(LocalizeText('catalog.marketplace.not_available_header'), NotificationAlertType.DEFAULT, null, null, LocalizeText('catalog.marketplace.not_available_title'));
                break;
            case 3:
                // our shit was updated
                // todo: some dialogue modal 
                setOffers( prev =>
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

                NotificationUtilities.confirm(LocalizeText('catalog.marketplace.confirm_higher_header') + 
                '\n' + LocalizeText('catalog.marketplace.confirm_price', ['price'], [parser.newPrice.toString()]), () =>
                {
                    SendMessageHook(new BuyMarketplaceOfferMessageComposer(parser.offerId));
                },
                null, null, null, LocalizeText('catalog.marketplace.confirm_higher_title'));
                break;
            case 4:
                NotificationUtilities.simpleAlert(LocalizeText('catalog.alert.notenough.credits.description'), NotificationAlertType.DEFAULT, null, null, LocalizeText('catalog.alert.notenough.title'));
                break;
        }
    }, [lastSearch, requestOffers]);

    CreateMessageHook(MarketPlaceOffersEvent, onMarketPlaceOffersEvent);
    CreateMessageHook(MarketplaceBuyOfferResultEvent, onMarketplaceBuyOfferResultEvent);
    
    return (<>
        <div className="btn-group" role="group">
            <button type="button" className={`btn btn-primary ${searchType === MarketplaceSearchType.BY_ACTIVITY ? 'active' : ''}`} onClick={() => setSearchType(MarketplaceSearchType.BY_ACTIVITY)}>
                { LocalizeText('catalog.marketplace.search_by_activity') }
            </button>
            <button type="button" className={`btn btn-primary ${searchType === MarketplaceSearchType.BY_VALUE ? 'active' : ''}`} onClick={() => setSearchType(MarketplaceSearchType.BY_VALUE)}>
                { LocalizeText('catalog.marketplace.search_by_value') }
            </button>
            <button type="button" className={`btn btn-primary ${searchType === MarketplaceSearchType.ADVANCED ? 'active' : ''}`} onClick={() => setSearchType(MarketplaceSearchType.ADVANCED)}>
                { LocalizeText('catalog.marketplace.search_advanced') }
            </button>
        </div>

        <SearchFormView sortTypes={ getSortTypes } searchType={ searchType } onSearch={ requestOffers }/>

        <div className='text-black'>{LocalizeText('catalog.marketplace.items_found', ['count'], [offers.size.toString()])}</div>
        <NitroCardGridView columns={1} className='text-black'>
            { 
                Array.from(offers.values()).map( (entry, index) => <MarketplaceItemView key={ index } offerData={ entry } type={ PUBLIC_OFFER } onClick={purchaseItem} />)
            }
        </NitroCardGridView>
    </>);
}
