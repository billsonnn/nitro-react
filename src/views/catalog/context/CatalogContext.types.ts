import { Dispatch, ProviderProps } from 'react';
import { ICatalogAction, ICatalogState } from '../reducers/CatalogReducer';

export interface ICatalogContext
{
    catalogState: ICatalogState;
    dispatchCatalogState: Dispatch<ICatalogAction>;
}

export interface CatalogContextProps extends ProviderProps<ICatalogContext>
{

}
