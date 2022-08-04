import { FurniturePlacePaintComposer, RoomObjectCategory, RoomObjectPlacementSource, RoomObjectType } from '@nitrots/nitro-renderer';
import { CreateLinkEvent, GetRoomEngine, GetRoomSessionManager, SendMessageComposer } from '../nitro';
import { FurniCategory } from './FurniCategory';
import { GroupItem } from './GroupItem';
import { IBotItem } from './IBotItem';
import { IPetItem } from './IPetItem';

let objectMoverRequested = false;
let itemIdInPlacing = -1;

export const isObjectMoverRequested = () => objectMoverRequested;

export const setObjectMoverRequested = (flag: boolean) => objectMoverRequested = flag;

export const getPlacingItemId = () => itemIdInPlacing;

export const setPlacingItemId = (id: number) => (itemIdInPlacing = id);

export const cancelRoomObjectPlacement = () =>
{
    if(getPlacingItemId() === -1) return;
    
    GetRoomEngine().cancelRoomObjectPlacement();

    setPlacingItemId(-1);
    setObjectMoverRequested(false);
}

export const attemptPetPlacement = (petItem: IPetItem, flag: boolean = false) =>
{
    const petData = petItem.petData;

    if(!petData) return false;

    const session = GetRoomSessionManager().getSession(1);

    if(!session) return false;

    if(!session.isRoomOwner && !session.allowPets) return false;

    CreateLinkEvent('inventory/hide');

    if(GetRoomEngine().processRoomObjectPlacement(RoomObjectPlacementSource.INVENTORY, -(petData.id), RoomObjectCategory.UNIT, RoomObjectType.PET, petData.figureData.figuredata))
    {
        setPlacingItemId(petData.id);
        setObjectMoverRequested(true);
    }

    return true;
}

export const attemptItemPlacement = (groupItem: GroupItem, flag: boolean = false) =>
{
    if(!groupItem || !groupItem.getUnlockedCount()) return false;

    const item = groupItem.getLastItem();

    if(!item) return false;

    if((item.category === FurniCategory.FLOOR) || (item.category === FurniCategory.WALL_PAPER) || (item.category === FurniCategory.LANDSCAPE))
    {
        if(flag) return false;

        SendMessageComposer(new FurniturePlacePaintComposer(item.id));

        return false;
    }
    else
    {
        CreateLinkEvent('inventory/hide');

        let category = 0;
        let isMoving = false;

        if(item.isWallItem) category = RoomObjectCategory.WALL;
        else category = RoomObjectCategory.FLOOR;

        if((item.category === FurniCategory.POSTER)) // or external image from furnidata
        {
            isMoving = GetRoomEngine().processRoomObjectPlacement(RoomObjectPlacementSource.INVENTORY, item.id, category, item.type, item.stuffData.getLegacyString());
        }
        else
        {
            isMoving = GetRoomEngine().processRoomObjectPlacement(RoomObjectPlacementSource.INVENTORY, item.id, category, item.type, item.extra.toString(), item.stuffData);
        }

        if(isMoving)
        {
            setPlacingItemId(item.ref);
            setObjectMoverRequested(true);
        }
    }

    return true;
}


export const attemptBotPlacement = (botItem: IBotItem, flag: boolean = false) =>
{
    const botData = botItem.botData;

    if(!botData) return false;

    const session = GetRoomSessionManager().getSession(1);

    if(!session || !session.isRoomOwner) return false;

    CreateLinkEvent('inventory/hide');

    if(GetRoomEngine().processRoomObjectPlacement(RoomObjectPlacementSource.INVENTORY, -(botData.id), RoomObjectCategory.UNIT, RoomObjectType.RENTABLE_BOT, botData.figure))
    {
        setPlacingItemId(botData.id);
        setObjectMoverRequested(true);
    }

    return true;
}
