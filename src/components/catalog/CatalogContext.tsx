import { FrontPageItem, RoomPreviewer } from '@nitrots/nitro-renderer';
import { createContext, Dispatch, FC, ProviderProps, SetStateAction, useContext } from 'react';
import { ICatalogNode } from './common/ICatalogNode';
import { ICatalogOptions } from './common/ICatalogOptions';
import { ICatalogPage } from './common/ICatalogPage';
import { IPageLocalization } from './common/IPageLocalization';
import { IPurchasableOffer } from './common/IPurchasableOffer';
import { IPurchaseOptions } from './common/IPurchaseOptions';
import { SearchResult } from './common/SearchResult';

interface ICatalogContext
{
    isVisible: boolean;
    isBusy: boolean;
    setIsBusy: Dispatch<SetStateAction<boolean>>;
    pageId: number;
    currentType: string;
    setCurrentType: Dispatch<SetStateAction<string>>;
    rootNode: ICatalogNode;
    setRootNode: Dispatch<SetStateAction<ICatalogNode>>;
    offersToNodes: Map<number, ICatalogNode[]>;
    setOffersToNodes: Dispatch<SetStateAction<Map<number, ICatalogNode[]>>>;
    currentPage: ICatalogPage;
    setCurrentPage: Dispatch<SetStateAction<ICatalogPage>>;
    currentOffer: IPurchasableOffer;
    setCurrentOffer: Dispatch<SetStateAction<IPurchasableOffer>>;
    activeNodes: ICatalogNode[];
    setActiveNodes: Dispatch<SetStateAction<ICatalogNode[]>>;
    searchResult: SearchResult;
    setSearchResult: Dispatch<SetStateAction<SearchResult>>;
    frontPageItems: FrontPageItem[];
    setFrontPageItems: Dispatch<SetStateAction<FrontPageItem[]>>;
    roomPreviewer: RoomPreviewer;
    purchaseOptions: IPurchaseOptions;
    setPurchaseOptions: Dispatch<SetStateAction<IPurchaseOptions>>;
    catalogOptions: ICatalogOptions;
    setCatalogOptions: Dispatch<SetStateAction<ICatalogOptions>>;
    resetState: () => void;
    getNodesByOfferId: (offerId: number, flag?: boolean) => ICatalogNode[];
    loadCatalogPage: (pageId: number, offerId: number) => void;
    showCatalogPage: (pageId: number, layoutCode: string, localization: IPageLocalization, offers: IPurchasableOffer[], offerId: number, acceptSeasonCurrencyAsCredits: boolean) => void;
    activateNode: (targetNode: ICatalogNode) => void;
}

const CatalogContext = createContext<ICatalogContext>({
    isVisible: null,
    isBusy: null,
    setIsBusy: null,
    pageId: null,
    currentType: null,
    setCurrentType: null,
    rootNode: null,
    setRootNode: null,
    offersToNodes: null,
    setOffersToNodes: null,
    currentPage: null,
    setCurrentPage: null,
    currentOffer: null,
    setCurrentOffer: null,
    activeNodes: null,
    setActiveNodes: null,
    searchResult: null,
    setSearchResult: null,
    frontPageItems: null,
    setFrontPageItems: null,
    roomPreviewer: null,
    purchaseOptions: null,
    setPurchaseOptions: null,
    catalogOptions: null,
    setCatalogOptions: null,
    resetState: null,
    getNodesByOfferId: null,
    loadCatalogPage: null,
    showCatalogPage: null,
    activateNode: null
});

export const CatalogContextProvider: FC<ProviderProps<ICatalogContext>> = props =>
{
    return <CatalogContext.Provider value={ props.value }>{ props.children }</CatalogContext.Provider>
}

export const useCatalogContext = () => useContext(CatalogContext);
