import { Dispatch, ProviderProps, SetStateAction } from 'react';
import { GroupItem } from '../../utils/GroupItem';

export interface IInventoryFurnitureContext
{
    setNeedsUpdate: Dispatch<SetStateAction<boolean>>;
    setGroupItems: Dispatch<SetStateAction<GroupItem[]>>;
}

export interface InventoryFurnitureContextProps extends ProviderProps<IInventoryFurnitureContext>
{

}
