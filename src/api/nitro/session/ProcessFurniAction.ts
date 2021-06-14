import { RoomAdsUpdateComposer, RoomObjectOperationType, SecurityLevel } from 'nitro-renderer';
import { GetConnection } from '../GetConnection';
import { GetRoomEngine } from '../room';
import { GetSessionDataManager } from './GetSessionDataManager';

export class FurniAction
{
    public static ROTATE: string = 'FA_ROTATE';
    public static MOVE: string = 'FA_MOVE';
    public static PICKUP: string = 'FA_PICKUP';
    public static EJECT: string = 'FA_EJECT';
    public static USE: string = 'FA_USE';
    public static OPEN_WELCOME_GIFT: string = 'FA_OPEN_WELCOME_GIFT';
    public static SAVE_STUFF_DATA: string = 'FA_SAVE_STUFF_DATA';
}

export function ProcessFurniAction(type: string, objectId: number, category: number, offerId = -1, objectData: string = null): void
{
    switch(type)
    {
        case FurniAction.ROTATE:
            GetRoomEngine().processRoomObjectOperation(objectId, category, RoomObjectOperationType.OBJECT_ROTATE_POSITIVE);
            return;
        case FurniAction.MOVE:
            GetRoomEngine().processRoomObjectOperation(objectId, category, RoomObjectOperationType.OBJECT_MOVE);
            return;
        case FurniAction.PICKUP:
            GetRoomEngine().processRoomObjectOperation(objectId, category, RoomObjectOperationType.OBJECT_PICKUP);
            return;
        case FurniAction.EJECT:
            GetRoomEngine().processRoomObjectOperation(objectId, category, RoomObjectOperationType.OBJECT_EJECT);
            return;
        case FurniAction.USE:
            GetRoomEngine().useRoomObject(objectId, category);
            return;
        case FurniAction.SAVE_STUFF_DATA: {
            if(objectData)
            {
                const mapData = new Map<string, string>();
                const dataParts = objectData.split('\t');

                if(dataParts)
                {
                    for(const part of dataParts)
                    {
                        const partPieces = part.split('=', 2);

                        if(partPieces && partPieces.length === 2)
                        {
                            const piece1 = partPieces[0];
                            const piece2 = partPieces[1];

                            mapData.set(piece1, piece2);
                        }
                    }
                }

                GetRoomEngine().processRoomObjectWallOperation(objectId, category, RoomObjectOperationType.OBJECT_SAVE_STUFF_DATA, mapData);
                
                if(GetSessionDataManager().hasSecurity(SecurityLevel.MODERATOR))
                {
                    GetConnection().send(new RoomAdsUpdateComposer(this._widget.furniData.id, mapData));
                }
                
                mapData.clear();
            }
            return;
        }
    }
}
