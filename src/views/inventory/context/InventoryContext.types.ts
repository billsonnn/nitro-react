import { Dispatch, ProviderProps } from 'react';
import { IInventoryFurnitureAction, IInventoryFurnitureState } from '../reducers/InventoryFurnitureReducer';

export interface IInventoryContext
{
    furnitureState: IInventoryFurnitureState;
    dispatchFurnitureState: Dispatch<IInventoryFurnitureAction>;
}

export interface InventoryContextProps extends ProviderProps<IInventoryContext>
{

}
