import { IRoomSession, RoomPreviewer } from 'nitro-renderer';
import { Dispatch, SetStateAction } from 'react';
import { GroupItem } from '../../utils/GroupItem';

export interface InventoryFurnitureViewProps
{
    needsFurniUpdate: boolean;
    setNeedsFurniUpdate: Dispatch<SetStateAction<boolean>>;
    groupItem: GroupItem;
    setGroupItem: Dispatch<SetStateAction<GroupItem>>;
    groupItems: GroupItem[];
    roomSession: IRoomSession;
    roomPreviewer: RoomPreviewer;
}
