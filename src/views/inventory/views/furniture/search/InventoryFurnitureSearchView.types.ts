import { Dispatch, SetStateAction } from 'react';
import { GroupItem } from '../../../utils/GroupItem';

export interface InventoryFurnitureSearchViewProps
{
    groupItems: GroupItem[];
    setGroupItems: Dispatch<SetStateAction<GroupItem[]>>;
}
