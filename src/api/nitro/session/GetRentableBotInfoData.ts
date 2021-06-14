import { RoomObjectVariable, RoomUserData } from 'nitro-renderer';
import { GetRoomEngine } from '../room';
import { GetRoomSession } from './GetRoomSession';
import { GetSessionDataManager } from './GetSessionDataManager';
import { RentableBotInfoData } from './RentableBotInfoData';
import { UserInfoData } from './UserInfoData';

export function GetRentableBotInfoData(roomId: number, objectId: number, category: number, userData: RoomUserData): RentableBotInfoData
{
    const rentBotInfoData = new RentableBotInfoData(UserInfoData.BOT);

    rentBotInfoData.name = userData.name;
    rentBotInfoData.motto = userData.custom;
    rentBotInfoData.webID = userData.webID;
    rentBotInfoData.userRoomId = objectId;
    rentBotInfoData.ownerId = userData.ownerId;
    rentBotInfoData.ownerName = userData.ownerName;
    rentBotInfoData.botSkills = userData.botSkills;

    const roomObject = GetRoomEngine().getRoomObject(roomId, objectId, category);

    if(roomObject) rentBotInfoData.carryItem = roomObject.model.getValue<number>(RoomObjectVariable.FIGURE_CARRY_OBJECT);

    rentBotInfoData.amIOwner = GetRoomSession().isRoomOwner;
    rentBotInfoData.roomControllerLevel = GetRoomSession().controllerLevel;
    rentBotInfoData.amIAnyRoomController = GetSessionDataManager().isModerator;
    rentBotInfoData.badges = [ 'BOT' ];
    rentBotInfoData.figure = userData.figure;

    return rentBotInfoData;
}
