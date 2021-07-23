import { Dispatch, ProviderProps } from 'react';
import { IUnseenItemTracker } from '../common/unseen/IUnseenItemTracker';
import { IInventoryBadgeAction, IInventoryBadgeState } from '../reducers/InventoryBadgeReducer';
import { IInventoryBotAction, IInventoryBotState } from '../reducers/InventoryBotReducer';
import { IInventoryFurnitureAction, IInventoryFurnitureState } from '../reducers/InventoryFurnitureReducer';
import { IInventoryPetAction, IInventoryPetState } from '../reducers/InventoryPetReducer';

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

export interface InventoryContextProps extends ProviderProps<IInventoryContext>
{

}
