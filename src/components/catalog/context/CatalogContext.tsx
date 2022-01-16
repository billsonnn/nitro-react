import { FrontPageItem } from '@nitrots/nitro-renderer';
import { createContext, Dispatch, FC, ProviderProps, SetStateAction, useContext } from 'react';
import { ICatalogNode } from '../common/ICatalogNode';
import { ICatalogPage } from '../common/ICatalogPage';
import { IPageLocalization } from '../common/IPageLocalization';
import { IPurchasableOffer } from '../common/IPurchasableOffer';
import { ICatalogAction, ICatalogState } from '../reducers/CatalogReducer';

export interface ICatalogContext
{
    isVisible: boolean;
    isBusy: boolean;
    setIsBusy: Dispatch<SetStateAction<boolean>>;
    pageId: number;
    currentType: string;
    setCurrentType: Dispatch<SetStateAction<string>>;
    currentNode: ICatalogNode;
    setCurrentNode: Dispatch<SetStateAction<ICatalogNode>>;
    currentOffers: Map<number, ICatalogNode[]>;
    setCurrentOffers: Dispatch<SetStateAction<Map<number, ICatalogNode[]>>>;
    currentPage: ICatalogPage;
    setCurrentPage: Dispatch<SetStateAction<ICatalogPage>>;
    currentOffer: IPurchasableOffer;
    setCurrentOffer: Dispatch<SetStateAction<IPurchasableOffer>>;
    purchasableOffer: IPurchasableOffer;
    setPurchasableOffer: Dispatch<SetStateAction<IPurchasableOffer>>;
    activeNodes: ICatalogNode[];
    setActiveNodes: Dispatch<SetStateAction<ICatalogNode[]>>;
    frontPageItems: FrontPageItem[];
    setFrontPageItems: Dispatch<SetStateAction<FrontPageItem[]>>;
    loadCatalogPage: (pageId: number, offerId: number, forceRefresh?: boolean) => void;
    showCatalogPage: (pageId: number, layoutCode: string, localization: IPageLocalization, offers: IPurchasableOffer[], offerId: number, acceptSeasonCurrencyAsCredits: boolean) => void;

    catalogState: ICatalogState;
    dispatchCatalogState: Dispatch<ICatalogAction>;
}

const CatalogContext = createContext<ICatalogContext>({
    isVisible: null,
    isBusy: null,
    setIsBusy: null,
    pageId: null,
    currentType: null,
    setCurrentType: null,
    currentNode: null,
    setCurrentNode: null,
    currentOffers: null,
    setCurrentOffers: null,
    currentPage: null,
    setCurrentPage: null,
    currentOffer: null,
    setCurrentOffer: null,
    purchasableOffer: null,
    setPurchasableOffer: null,
    activeNodes: null,
    setActiveNodes: null,
    frontPageItems: null,
    setFrontPageItems: null,
    loadCatalogPage: null,
    showCatalogPage: null,
    catalogState: null,
    dispatchCatalogState: null
});

export const CatalogContextProvider: FC<ProviderProps<ICatalogContext>> = props =>
{
    return <CatalogContext.Provider value={ props.value }>{ props.children }</CatalogContext.Provider>
}

export const useCatalogContext = () => useContext(CatalogContext);
