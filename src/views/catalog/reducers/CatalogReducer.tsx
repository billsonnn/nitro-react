import { CatalogPageOfferData, ICatalogPageData, ICatalogPageParser } from 'nitro-renderer';
import { Reducer } from 'react';
import { ICatalogOffers, ICatalogSearchResult, SetOffersToNodes } from '../utils/CatalogUtilities';

export interface ICatalogState
{
    root: ICatalogPageData;
    offerRoot: ICatalogOffers;
    currentTab: ICatalogPageData;
    pageParser: ICatalogPageParser;
    activeOffer: CatalogPageOfferData;
    searchResult: ICatalogSearchResult;
}

export interface ICatalogAction
{
    type: string;
    payload: {
        root?: ICatalogPageData;
        offerRoot?: ICatalogOffers;
        currentTab?: ICatalogPageData;
        pageParser?: ICatalogPageParser;
        activeOffer?: CatalogPageOfferData;
        searchResult?: ICatalogSearchResult;
    }
}

export class CatalogActions
{
    public static SET_CATALOG_ROOT: string = 'CA_SET_CATALOG_ROOT';
    public static SET_CATALOG_CURRENT_TAB: string = 'CA_SET_CATALOG_CURRENT_TAB';
    public static SET_CATALOG_PAGE_PARSER: string = 'CA_SET_CATALOG_PAGE';
    public static SET_CATALOG_ACTIVE_OFFER: string = 'CA_SET_ACTIVE_OFFER';
    public static SET_SEARCH_RESULT: string = 'CA_SET_SEARCH_RESULT';
}

export const initialCatalog: ICatalogState = {
    root: null,
    offerRoot: null,
    currentTab: null,
    pageParser: null,
    activeOffer: null,
    searchResult: null
}

export const CatalogReducer: Reducer<ICatalogState, ICatalogAction> = (state, action) =>
{
    switch(action.type)
    {
        case CatalogActions.SET_CATALOG_ROOT: {
            const root = (action.payload.root || state.root || null);
            const currentTab = ((root && (root.children.length > 0) && root.children[0]) || null);

            const offerRoot: ICatalogOffers = {};

            SetOffersToNodes(offerRoot, root);

            return { ...state, root, offerRoot, currentTab };
        }
        case CatalogActions.SET_CATALOG_CURRENT_TAB: {
            const currentTab = (action.payload.currentTab || state.currentTab || null);
            const searchResult = null;

            return { ...state, currentTab, searchResult };
        }
        case CatalogActions.SET_CATALOG_PAGE_PARSER: {
            const pageParser = action.payload.pageParser;
            const activeOffer = null;

            const searchResult = state.searchResult;

            if(searchResult)
            {
                searchResult.furniture = null;
            }

            return { ...state, pageParser, activeOffer, searchResult };
        }
        case CatalogActions.SET_CATALOG_ACTIVE_OFFER: {
            const activeOffer = (action.payload.activeOffer || state.activeOffer || null);

            return { ...state, activeOffer };
        }
        case CatalogActions.SET_SEARCH_RESULT: {
            const searchResult = (action.payload.searchResult || null);

            return { ...state, searchResult };
        }
        default:
            return state;
    }
}
