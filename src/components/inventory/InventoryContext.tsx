import { createContext, Dispatch, FC, ProviderProps, useContext } from 'react';
import { IUnseenItemTracker } from './common/unseen/IUnseenItemTracker';
import { IInventoryBadgeAction, IInventoryBadgeState } from './reducers/InventoryBadgeReducer';
import { IInventoryBotAction, IInventoryBotState } from './reducers/InventoryBotReducer';
import { IInventoryFurnitureAction, IInventoryFurnitureState } from './reducers/InventoryFurnitureReducer';
import { IInventoryPetAction, IInventoryPetState } from './reducers/InventoryPetReducer';

export interface IInventoryContext
{
    furnitureState: IInventoryFurnitureState;
    dispatchFurnitureState: Dispatch<IInventoryFurnitureAction>;
    botState: IInventoryBotState;
    dispatchBotState: Dispatch<IInventoryBotAction>;
    petState: IInventoryPetState;
    dispatchPetState: Dispatch<IInventoryPetAction>;
    badgeState: IInventoryBadgeState;
    dispatchBadgeState: Dispatch<IInventoryBadgeAction>;
    unseenTracker: IUnseenItemTracker;
}


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

export const InventoryContextProvider: FC<ProviderProps<IInventoryContext>> = props =>
{
    return <InventoryContext.Provider value={ props.value }>{ props.children }</InventoryContext.Provider>
}

export const useInventoryContext = () => useContext(InventoryContext);
