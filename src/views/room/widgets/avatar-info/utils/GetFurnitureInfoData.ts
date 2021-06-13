import { IFurnitureData, Nitro, ObjectDataFactory, RoomObjectCategory, RoomObjectVariable, RoomWidgetEnumItemExtradataParameter, Vector3d } from 'nitro-renderer';
import { GetRoomEngine, GetRoomSession, GetSessionDataManager } from '../../../../../api';
import { IsOwnerOfFurniture } from '../../../../room-host/utils/IsOwnerOfFurniture';
import { FurnitureInfoData } from './FurnitureInfoData';

export function GetFurnitureInfoData(roomId: number, objectId: number, category: number): FurnitureInfoData
{
    const furnitureInfoData = new FurnitureInfoData();

    furnitureInfoData.id = objectId;
    furnitureInfoData.category = category;

    const roomObject = GetRoomEngine().getRoomObject(roomId, objectId, category);

    if(!roomObject) return null;

    const model = roomObject.model;

    if(model.getValue<string>(RoomWidgetEnumItemExtradataParameter.INFOSTAND_EXTRA_PARAM))
    {
        furnitureInfoData.extraParam = model.getValue<string>(RoomWidgetEnumItemExtradataParameter.INFOSTAND_EXTRA_PARAM);
    }

    const dataFormat = model.getValue<number>(RoomObjectVariable.FURNITURE_DATA_FORMAT);
    const objectData = ObjectDataFactory.getData(dataFormat);

    objectData.initializeFromRoomObjectModel(model);

    furnitureInfoData.stuffData = objectData;

    const objectType = roomObject.type;

    if(objectType.indexOf('poster') === 0)
    {
        const posterId = parseInt(objectType.replace('poster', ''));

        furnitureInfoData.name = (('${poster_' + posterId) + '_name}');
        furnitureInfoData.description = (('${poster_' + posterId) + '_desc}');
    }
    else
    {
        const typeId = model.getValue<number>(RoomObjectVariable.FURNITURE_TYPE_ID);

        let furnitureData: IFurnitureData = null;

        if(category === RoomObjectCategory.FLOOR)
        {
            furnitureData = this._container.sessionDataManager.getFloorItemData(typeId);
        }

        else if(category === RoomObjectCategory.WALL)
        {
            furnitureData = this._container.sessionDataManager.getWallItemData(typeId);
        }

        if(furnitureData)
        {
            furnitureInfoData.name = furnitureData.name;
            furnitureInfoData.description = furnitureData.description;
            furnitureInfoData.purchaseOfferId = furnitureData.purchaseOfferId;
            furnitureInfoData.purchaseCouldBeUsedForBuyout = furnitureData.purchaseCouldBeUsedForBuyout;
            furnitureInfoData.rentOfferId = furnitureData.rentOfferId;
            furnitureInfoData.rentCouldBeUsedForBuyout = furnitureData.rentCouldBeUsedForBuyout;
            furnitureInfoData.availableForBuildersClub = furnitureData.availableForBuildersClub;

            // if(this._container.wiredService && (k.category === RoomObjectCategory.FLOOR))
            // {
            //     this._container.wiredService.selectFurniture(roomObject.id, furnitureData.name);
            // }
        }
    }

    if(objectType.indexOf('post_it') > -1) furnitureInfoData.isStickie = true;

    const expiryTime = model.getValue<number>(RoomObjectVariable.FURNITURE_EXPIRY_TIME);
    const expiryTimestamp = model.getValue<number>(RoomObjectVariable.FURNITURE_EXPIRTY_TIMESTAMP);

    furnitureInfoData.expiration = ((expiryTime < 0) ? expiryTime : Math.max(0, (expiryTime - ((Nitro.instance.time - expiryTimestamp) / 1000))));

    let roomObjectImage = GetRoomEngine().getRoomObjectImage(roomId, objectId, category, new Vector3d(180), 64, null);

    if(!roomObjectImage.data || (roomObjectImage.data.width > 140) || (roomObjectImage.data.height > 200))
    {
        roomObjectImage = GetRoomEngine().getRoomObjectImage(roomId, objectId, category, new Vector3d(180), 1, null);
    }

    if(roomObjectImage && roomObjectImage.data)
    {
        const image = Nitro.instance.renderer.extract.image(roomObjectImage.data);

        if(image) furnitureInfoData.image = image;
    }

    furnitureInfoData.isWallItem = (category === RoomObjectCategory.WALL);
    furnitureInfoData.isRoomOwner = GetRoomSession().isRoomOwner;
    furnitureInfoData.roomControllerLevel = GetRoomSession().controllerLevel;
    furnitureInfoData.isAnyRoomController = GetSessionDataManager().isModerator;
    furnitureInfoData.ownerId = model.getValue<number>(RoomObjectVariable.FURNITURE_OWNER_ID);
    furnitureInfoData.ownerName = model.getValue<string>(RoomObjectVariable.FURNITURE_OWNER_NAME);
    furnitureInfoData.usagePolicy = model.getValue<number>(RoomObjectVariable.FURNITURE_USAGE_POLICY);

    const guildId = model.getValue<number>(RoomObjectVariable.FURNITURE_GUILD_CUSTOMIZED_GUILD_ID);

    if(guildId !== 0)
    {
        furnitureInfoData.groupId = guildId;
        //this.container.connection.send(new _Str_2863(guildId, false));
    }

    if(IsOwnerOfFurniture(roomObject)) furnitureInfoData.isOwner = true;

    return furnitureInfoData;
}
