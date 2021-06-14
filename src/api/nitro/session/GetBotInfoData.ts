import { RoomObjectVariable, RoomUserData } from 'nitro-renderer';
import { GetRoomEngine } from '../room';
import { GetRoomSession } from './GetRoomSession';
import { GetSessionDataManager } from './GetSessionDataManager';
import { UserInfoData } from './UserInfoData';

export function GetBotInfoData(roomId: number, objectId: number, category: number, userData: RoomUserData): UserInfoData
{
    const userInfoData = new UserInfoData(UserInfoData.BOT);

    userInfoData.name = userData.name;
    userInfoData.motto = userData.custom;
    userInfoData.webID = userData.webID;
    userInfoData.userRoomId = objectId;
    userInfoData.userType = userData.type;

    const roomObject = GetRoomEngine().getRoomObject(roomId, objectId, category);

    if(roomObject) userInfoData.carryItem = roomObject.model.getValue<number>(RoomObjectVariable.FIGURE_CARRY_OBJECT);

    userInfoData.amIOwner = GetRoomSession().isRoomOwner;
    userInfoData.isGuildRoom = GetRoomSession().isGuildRoom;
    userInfoData.roomControllerLevel = GetRoomSession().controllerLevel;
    userInfoData.amIAnyRoomController = GetSessionDataManager().isModerator;
    userInfoData.isAmbassador = GetSessionDataManager().isAmbassador;
    userInfoData.badges = [ 'BOT' ];
    userInfoData.figure = userData.figure;

    return userInfoData;
}
