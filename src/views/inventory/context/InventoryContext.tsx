import { createContext, FC, useContext } from 'react';
import { IInventoryContext, InventoryContextProps } from './InventoryContext.types';

const InventoryContext = createContext<IInventoryContext>({
    furnitureState: null,
    dispatchFurnitureState: null,
    botState: null,
    dispatchBotState: null,
    petState: null,
    dispatchPetState: null,
    badgeState: null,
    dispatchBadgeState: null,
    unseenTracker: null
});

export const InventoryContextProvider: FC<InventoryContextProps> = props =>
{
    return <InventoryContext.Provider value={ props.value }>{ props.children }</InventoryContext.Provider>
}

export const useInventoryContext = () => useContext(InventoryContext);
