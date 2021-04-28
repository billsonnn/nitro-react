import { createContext, FC, useContext } from 'react';
import { IInventoryContext, InventoryContextProps } from './InventoryContext.types';

const InventoryContext = createContext<IInventoryContext>({
    furnitureState: null,
    dispatchFurnitureState: null
});

export const InventoryContextProvider: FC<InventoryContextProps> = props =>
{
    return <InventoryContext.Provider value={ props.value }>{ props.children }</InventoryContext.Provider>
}

export const useInventoryContext = () => useContext(InventoryContext);
