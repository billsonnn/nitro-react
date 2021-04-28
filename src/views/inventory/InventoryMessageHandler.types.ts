import { Dispatch, SetStateAction } from 'react';
import { GroupItem } from './utils/GroupItem';

export interface InventoryMessageHandlerProps
{
    setNeedsFurniUpdate: Dispatch<SetStateAction<boolean>>;
    setGroupItems: Dispatch<SetStateAction<GroupItem[]>>;
}
