import { ICatalogPageData, ICatalogPageParser } from 'nitro-renderer';
import { Reducer } from 'react';

export interface ICatalogState
{
    needsCatalogUpdate: boolean;
    root: ICatalogPageData;
    pageParser: ICatalogPageParser;
}

export interface ICatalogAction
{
    type: string;
    payload: {
        flag?: boolean;
        root?: ICatalogPageData;
        pageParser?: ICatalogPageParser;
    }
}

export class CatalogActions
{
    public static SET_NEEDS_UPDATE: string = 'CA_SET_NEEDS_UPDATE';
    public static SET_CATALOG_ROOT: string = 'CA_SET_CATALOG_ROOT';
    public static SET_CATALOG_PAGE_PARSER: string = 'CA_SET_CATALOG_PAGE';
}

export const initialCatalog: ICatalogState = {
    needsCatalogUpdate: true,
    root: null,
    pageParser: null
}

export const CatalogReducer: Reducer<ICatalogState, ICatalogAction> = (state, action) =>
{
    switch(action.type)
    {
        case CatalogActions.SET_CATALOG_ROOT: {
            const root = (action.payload.root || state.root || null);

            return { ...state, root };
        }
        case CatalogActions.SET_CATALOG_PAGE_PARSER: {
            const pageParser = (action.payload.pageParser || state.pageParser || null);

            return { ...state, pageParser };
        }
        default:
            return state;
    }
}
