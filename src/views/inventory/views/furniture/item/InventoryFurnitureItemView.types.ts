import { Dispatch, SetStateAction } from 'react';
import { GroupItem } from '../../../utils/GroupItem';

export interface InventoryFurnitureItemViewProps
{
    groupItem: GroupItem;
    isActive: boolean;
    setGroupItem: Dispatch<SetStateAction<GroupItem>>;
}
