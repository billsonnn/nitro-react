import { createContext, FC, useContext } from 'react';
import { CatalogContextProps, ICatalogContext } from './CatalogContext.types';

const CatalogContext = createContext<ICatalogContext>({
    catalogState: null,
    dispatchCatalogState: null
});

export const CatalogContextProvider: FC<CatalogContextProps> = props =>
{
    return <CatalogContext.Provider value={ props.value }>{ props.children }</CatalogContext.Provider>
}

export const useCatalogContext = () => useContext(CatalogContext);
