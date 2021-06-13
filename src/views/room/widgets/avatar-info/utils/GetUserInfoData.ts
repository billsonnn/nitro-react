import { RoomControllerLevel, RoomModerationParser, RoomObjectType, RoomObjectVariable, RoomTradingLevelEnum, RoomUserData } from 'nitro-renderer';
import { GetRoomEngine, GetRoomSession, GetSessionDataManager } from '../../../../../api';
import { UserInfoData } from './UserInfoData';

export const _Str_18400: number = 0;
export const _Str_14161: number = 2;
export const _Str_13798: number = 3;

export function GetUserInfoData(roomId: number, objectId: number, category: number, userData: RoomUserData): UserInfoData
{
    const isOwnUser = false;

    const userInfoData = new UserInfoData();

    userInfoData.isSpectatorMode = GetRoomSession().isSpectator;
    userInfoData.name = userData.name;
    userInfoData.motto = userData.custom;
    userInfoData.achievementScore = userData.activityPoints;
    userInfoData.webID = userData.webID;
    userInfoData.userRoomId = objectId;
    userInfoData.userType = RoomObjectType.USER;

    const roomObject = GetRoomEngine().getRoomObject(roomId, objectId, category);

    if(roomObject) userInfoData.carryItem = roomObject.model.getValue<number>(RoomObjectVariable.FIGURE_CARRY_OBJECT);

    if(isOwnUser)
    {
        userInfoData.realName = GetSessionDataManager().realName;
        userInfoData.allowNameChange = GetSessionDataManager().canChangeName;
    }

    userInfoData.amIOwner = GetRoomSession().isRoomOwner;
    userInfoData.isGuildRoom = GetRoomSession().isGuildRoom;
    userInfoData.roomControllerLevel = GetRoomSession().controllerLevel;
    userInfoData.amIAnyRoomController = GetSessionDataManager().isModerator;
    userInfoData.isAmbassador = GetSessionDataManager().isAmbassador;

    if(!isOwnUser)
    {
        // userInfoData.canBeAskedAsFriend = this._container.friendService.canBeAskedForAFriend(userData.webID);

        // const friend = this._container.friendService.getFriend(userData.webID);

        // if(friend)
        // {
        //     userInfoData.realName  = friend.realName;
        //     userInfoData.isFriend  = true;
        // }

        if(roomObject)
        {
            const flatControl = roomObject.model.getValue<number>(RoomObjectVariable.FIGURE_FLAT_CONTROL);

            if(flatControl !== null) userInfoData.targetRoomControllerLevel = flatControl;

            userInfoData.canBeMuted = canBeMuted(userInfoData);
            userInfoData.canBeKicked = canBeKicked(userInfoData);
            userInfoData.canBeBanned = canBeBanned(userInfoData);
        }

        userInfoData.isIgnored = GetSessionDataManager().isUserIgnored(userData.name);
        userInfoData.respectLeft = GetSessionDataManager().respectsLeft;

        const isShuttingDown = GetSessionDataManager().isSystemShutdown;
        const tradeMode = GetRoomSession().tradeMode;

        if(isShuttingDown)
        {
            userInfoData.canTrade = false;
        }
        else
        {
            switch(tradeMode)
            {
                case RoomTradingLevelEnum._Str_14475: {
                    const roomController = ((userInfoData.roomControllerLevel !== RoomControllerLevel.NONE) && (userInfoData.roomControllerLevel !== RoomControllerLevel.GUILD_MEMBER));
                    const targetController = ((userInfoData.targetRoomControllerLevel !== RoomControllerLevel.NONE) && (userInfoData.targetRoomControllerLevel !== RoomControllerLevel.GUILD_MEMBER));

                    userInfoData.canTrade = (roomController || targetController);
                    break;
                }
                case RoomTradingLevelEnum._Str_9173:
                    userInfoData.canTrade = true;
                    break;
                default:
                    userInfoData.canTrade = false;
                    break;
            }
        }

        userInfoData.canTradeReason = _Str_18400;

        if(isShuttingDown) userInfoData.canTradeReason = _Str_14161;

        if(tradeMode !== RoomTradingLevelEnum._Str_9173) userInfoData.canTradeReason = _Str_13798;

        // const _local_12 = GetSessionDataManager().userId;
        // _local_13 = GetSessionDataManager()._Str_18437(_local_12);
        // this._Str_16287(_local_12, _local_13);
    }

    userInfoData.groupId = parseInt(userData.guildId);
    //event._Str_5235 = GetSessionDataManager()._Str_17173(int(userData._Str_4592));
    userInfoData.groupName = userData.groupName;
    userInfoData.badges = GetRoomSession().userDataManager.getUserBadges(userData.webID);
    userInfoData.figure = userData.figure;
    //var _local_8:Array = GetSessionDataManager()._Str_18437(userData.webID);
    //this._Str_16287(userData._Str_2394, _local_8);
    //this._container._Str_8097._Str_14387(userData.webID);
    //this._container.connection.send(new _Str_8049(userData._Str_2394));

    return userInfoData;
}

function checkGuildSetting(userInfoData: UserInfoData): boolean
{
    if(userInfoData.isGuildRoom) return (userInfoData.roomControllerLevel >= RoomControllerLevel.GUILD_ADMIN);

    return (userInfoData.roomControllerLevel >= RoomControllerLevel.GUEST);
}

function canBeMuted(userInfoData: UserInfoData): boolean
{
    const checkSetting = function(userInfoData: UserInfoData, moderation: RoomModerationParser)
    {
        switch(moderation.allowMute)
        {
            case RoomModerationParser._Str_5047:
                return checkGuildSetting(userInfoData);
            default:
                return (userInfoData.roomControllerLevel >= RoomControllerLevel.ROOM_OWNER);
        }
    }

    return isValidSetting(userInfoData, checkSetting);
}

function canBeKicked(userInfoData: UserInfoData): boolean
{
    const checkSetting = function(userInfoData: UserInfoData, moderation: RoomModerationParser)
    {
        switch(moderation.allowKick)
        {
            case RoomModerationParser._Str_11537:
                return true;
            case RoomModerationParser._Str_5047:
                return checkGuildSetting(userInfoData);
            default:
                return (userInfoData.roomControllerLevel >= RoomControllerLevel.ROOM_OWNER);
        }
    }

    return isValidSetting(userInfoData, checkSetting);
}

function canBeBanned(userInfoData: UserInfoData): boolean
{
    const checkSetting = function(userInfoData: UserInfoData, moderation: RoomModerationParser)
    {
        switch(moderation.allowBan)
        {
            case RoomModerationParser._Str_5047:
                return checkGuildSetting(userInfoData);
            default:
                return (userInfoData.roomControllerLevel >= RoomControllerLevel.ROOM_OWNER);
        }
    }

    return isValidSetting(userInfoData, checkSetting);
}

function isValidSetting(userInfoData: UserInfoData, checkSetting: (userInfoData: UserInfoData, moderation: RoomModerationParser) => boolean): boolean
{
    if(!GetRoomSession()._Str_7411) return false;

    const moderation = GetRoomSession().moderationSettings;

    let flag = false;

    if(moderation) flag = checkSetting(userInfoData, moderation);

    return (flag && (userInfoData.roomControllerLevel < RoomControllerLevel.ROOM_OWNER));
}
