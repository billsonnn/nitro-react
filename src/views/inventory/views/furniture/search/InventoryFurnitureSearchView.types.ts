import { Dispatch, SetStateAction } from 'react';
import { GroupItem } from '../../../common/GroupItem';

export interface InventoryFurnitureSearchViewProps
{
    groupItems: GroupItem[];
    setGroupItems: Dispatch<SetStateAction<GroupItem[]>>;
}
