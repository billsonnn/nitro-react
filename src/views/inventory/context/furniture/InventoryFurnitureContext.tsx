import { createContext, FC, useContext } from 'react';
import { IInventoryFurnitureContext, InventoryFurnitureContextProps } from './InventoryFurnitureContext.types';

const InventoryFurnitureContext = createContext<IInventoryFurnitureContext>({
    setNeedsUpdate: null,
    setGroupItems: null
});

export const InventoryFurnitureContextProvider: FC<InventoryFurnitureContextProps> = props =>
{
    return <InventoryFurnitureContext.Provider value={ props.value }>{ props.children }</InventoryFurnitureContext.Provider>
}

export const useInventoryFurnitureContext = () => useContext(InventoryFurnitureContext);
