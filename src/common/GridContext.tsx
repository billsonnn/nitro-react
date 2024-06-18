import { createContext, FC, ProviderProps, useContext } from 'react';

export interface IGridContext
{
    isCssGrid: boolean;
}

const GridContext = createContext<IGridContext>({
    isCssGrid: false
});

export const GridContextProvider: FC<ProviderProps<IGridContext>> = props =>
{
    return <GridContext.Provider value={ props.value }>{ props.children }</GridContext.Provider>;
};

export const useGridContext = () => useContext(GridContext);
