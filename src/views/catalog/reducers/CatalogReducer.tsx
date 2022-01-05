import { CatalogPageMessageOfferData, CatalogPageMessageParser, ClubGiftInfoParser, ClubOfferData, GiftWrappingConfigurationParser, INodeData, MarketplaceConfigurationMessageParser } from '@nitrots/nitro-renderer';
import { HabboGroupEntryData } from '@nitrots/nitro-renderer/src/nitro/communication/messages/parser/user/HabboGroupEntryData';
import { Reducer } from 'react';
import { CatalogPetPalette } from '../common/CatalogPetPalette';
import { ICatalogOffers, ICatalogSearchResult, SetOffersToNodes } from '../common/CatalogUtilities';
import { GiftWrappingConfiguration } from '../common/GiftWrappingConfiguration';
import { SubscriptionInfo } from '../common/SubscriptionInfo';

export interface ICatalogState
{
    root: INodeData;
    offerRoot: ICatalogOffers;
    currentTab: INodeData;
    pageParser: CatalogPageMessageParser;
    activeOffer: CatalogPageMessageOfferData;
    searchResult: ICatalogSearchResult;
    groups: HabboGroupEntryData[];
    petPalettes: CatalogPetPalette[];
    clubOffers: ClubOfferData[];
    clubGifts: ClubGiftInfoParser;
    subscriptionInfo: SubscriptionInfo;
    giftConfiguration: GiftWrappingConfiguration;
    marketplaceConfiguration: MarketplaceConfigurationMessageParser;
}

export interface ICatalogAction
{
    type: string;
    payload: {
        root?: INodeData;
        offerRoot?: ICatalogOffers;
        currentTab?: INodeData;
        pageParser?: CatalogPageMessageParser;
        activeOffer?: CatalogPageMessageOfferData;
        searchResult?: ICatalogSearchResult;
        groups?: HabboGroupEntryData[];
        petPalette?: CatalogPetPalette;
        clubOffers?: ClubOfferData[];
        clubGifts?: ClubGiftInfoParser;
        subscriptionInfo?: SubscriptionInfo;
        giftConfiguration?: GiftWrappingConfigurationParser;
        marketplaceConfiguration?: MarketplaceConfigurationMessageParser;
    }
}

export class CatalogActions
{
    public static RESET_STATE: string = 'CA_RESET_STATE';
    public static SET_CATALOG_ROOT: string = 'CA_SET_CATALOG_ROOT';
    public static SET_CATALOG_CURRENT_TAB: string = 'CA_SET_CATALOG_CURRENT_TAB';
    public static SET_CATALOG_PAGE_PARSER: string = 'CA_SET_CATALOG_PAGE';
    public static SET_CATALOG_ACTIVE_OFFER: string = 'CA_SET_ACTIVE_OFFER';
    public static SET_CLUB_OFFERS: string = 'CA_SET_CLUB_OFFERS';
    public static SET_GROUPS: string = 'CA_SET_GROUPS';
    public static SET_PET_PALETTE: string = 'CA_SET_PET_PALETTE';
    public static SET_SEARCH_RESULT: string = 'CA_SET_SEARCH_RESULT';
    public static SET_SUBSCRIPTION_INFO: string = 'CA_SET_SUBSCRIPTION_INFO';
    public static SET_GIFT_CONFIGURATION: string = 'CA_SET_GIFT_CONFIGURATION';
    public static SET_CLUB_GIFTS: string = 'CA_SET_CLUB_GIFTS';
    public static SET_MARKETPLACE_CONFIGURATION: string = 'CA_SET_MARKETPLACE_CONFIGURATION';
}

export const initialCatalog: ICatalogState = {
    root: null,
    offerRoot: null,
    currentTab: null,
    pageParser: null,
    activeOffer: null,
    searchResult: null,
    groups: [],
    petPalettes: [],
    clubOffers: null,
    clubGifts: null,
    subscriptionInfo: new SubscriptionInfo(),
    giftConfiguration: null,
    marketplaceConfiguration: null
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
            let pageParser = (Object.create(action.payload.pageParser) as CatalogPageMessageParser);
            let activeOffer = null;

            if(pageParser.layoutCode === 'single_bundle')
            {
                activeOffer = ((pageParser.offers && pageParser.offers[0]) || null);
            }

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
        case CatalogActions.SET_GROUPS: {
            const groups = (action.payload.groups || null);

            return { ...state, groups };
        }
        case CatalogActions.SET_PET_PALETTE: {
            const petPalette = (action.payload.petPalette || null);

            let petPalettes = [ ...state.petPalettes ];

            for(let i = 0; i < petPalettes.length; i++)
            {
                const palette = petPalettes[i];

                if(palette.breed === petPalette.breed)
                {
                    petPalettes.splice(i, 1);

                    break;
                }
            }

            petPalettes.push(petPalette);

            return { ...state, petPalettes };
        }
        case CatalogActions.SET_CLUB_OFFERS: {
            const clubOffers = (action.payload.clubOffers || null);

            return { ...state, clubOffers };
        }
        case CatalogActions.SET_SUBSCRIPTION_INFO: {
            const subscriptionInfo = (action.payload.subscriptionInfo || null);

            return { ...state, subscriptionInfo };
        }
        case CatalogActions.RESET_STATE: {
            return { ...initialCatalog };
        }
        case CatalogActions.SET_GIFT_CONFIGURATION: {
            const giftConfiguration = new GiftWrappingConfiguration((action.payload.giftConfiguration || null));

            return { ...state, giftConfiguration };
        }
        case CatalogActions.SET_CLUB_GIFTS: {
            const clubGifts = (action.payload.clubGifts || state.clubGifts || null);

            return { ...state, clubGifts };
        }
        case CatalogActions.SET_MARKETPLACE_CONFIGURATION: {
            const marketplaceConfiguration = (action.payload.marketplaceConfiguration || state.marketplaceConfiguration || null);

            return { ...state, marketplaceConfiguration }
        }
        default:
            return state;
    }
}
