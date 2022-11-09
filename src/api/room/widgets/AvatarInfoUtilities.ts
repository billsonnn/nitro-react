import { GetTickerTime, IFurnitureData, IRoomModerationSettings, IRoomPetData, IRoomUserData, ObjectDataFactory, PetFigureData, PetType, RoomControllerLevel, RoomModerationSettings, RoomObjectCategory, RoomObjectType, RoomObjectVariable, RoomTradingLevelEnum, RoomWidgetEnumItemExtradataParameter, Vector3d } from '@nitrots/nitro-renderer';
import { GetRoomEngine, GetRoomSession, GetSessionDataManager, IsOwnerOfFurniture } from '../../nitro';
import { LocalizeText } from '../../utils';
import { AvatarInfoFurni } from './AvatarInfoFurni';
import { AvatarInfoName } from './AvatarInfoName';
import { AvatarInfoPet } from './AvatarInfoPet';
import { AvatarInfoRentableBot } from './AvatarInfoRentableBot';
import { AvatarInfoUser } from './AvatarInfoUser';

export class AvatarInfoUtilities
{
    public static getObjectName(objectId: number, category: number): AvatarInfoName
    {
        const roomSession = GetRoomSession();

        let id = -1;
        let name: string = null;
        let userType = 0;

        switch(category)
        {
            case RoomObjectCategory.FLOOR:
            case RoomObjectCategory.WALL: {
                const roomObject = GetRoomEngine().getRoomObject(roomSession.roomId, objectId, category);

                if(!roomObject) break;

                if(roomObject.type.indexOf('poster') === 0)
                {
                    name = LocalizeText('${poster_' + parseInt(roomObject.type.replace('poster', '')) + '_name}');
                }
                else
                {
                    let furniData: IFurnitureData = null;

                    const typeId = roomObject.model.getValue<number>(RoomObjectVariable.FURNITURE_TYPE_ID);

                    if(category === RoomObjectCategory.FLOOR)
                    {
                        furniData = GetSessionDataManager().getFloorItemData(typeId);
                    }

                    else if(category === RoomObjectCategory.WALL)
                    {
                        furniData = GetSessionDataManager().getWallItemData(typeId);
                    }

                    if(!furniData) break;

                    id = furniData.id;
                    name = furniData.name;
                }
                break;
            }
            case RoomObjectCategory.UNIT: {
                const userData = roomSession.userDataManager.getUserDataByIndex(objectId);

                if(!userData) break;

                id = userData.webID;
                name = userData.name;
                userType = userData.type;
                break;
            }
        }

        if(!name || !name.length) return null;

        return new AvatarInfoName(objectId, category, id, name, userType);
    }

    public static getFurniInfo(objectId: number, category: number): AvatarInfoFurni
    {
        const roomSession = GetRoomSession();
        const furniInfo = new AvatarInfoFurni(AvatarInfoFurni.FURNI);

        furniInfo.id = objectId;
        furniInfo.category = category;

        const roomObject = GetRoomEngine().getRoomObject(roomSession.roomId, objectId, category);

        if(!roomObject) return;

        const model = roomObject.model;

        if(model.getValue<string>(RoomWidgetEnumItemExtradataParameter.INFOSTAND_EXTRA_PARAM))
        {
            furniInfo.extraParam = model.getValue<string>(RoomWidgetEnumItemExtradataParameter.INFOSTAND_EXTRA_PARAM);
        }

        const dataFormat = model.getValue<number>(RoomObjectVariable.FURNITURE_DATA_FORMAT);
        const objectData = ObjectDataFactory.getData(dataFormat);

        objectData.initializeFromRoomObjectModel(model);

        furniInfo.stuffData = objectData;

        const objectType = roomObject.type;

        if(objectType.indexOf('poster') === 0)
        {
            const posterId = parseInt(objectType.replace('poster', ''));

            furniInfo.name = LocalizeText(('${poster_' + posterId) + '_name}');
            furniInfo.description = LocalizeText(('${poster_' + posterId) + '_desc}');
        }
        else
        {
            const typeId = model.getValue<number>(RoomObjectVariable.FURNITURE_TYPE_ID);

            let furnitureData: IFurnitureData = null;

            if(category === RoomObjectCategory.FLOOR)
            {
                furnitureData = GetSessionDataManager().getFloorItemData(typeId);
            }

            else if(category === RoomObjectCategory.WALL)
            {
                furnitureData = GetSessionDataManager().getWallItemData(typeId);
            }

            if(furnitureData)
            {
                furniInfo.name = furnitureData.name;
                furniInfo.description = furnitureData.description;
                furniInfo.purchaseOfferId = furnitureData.purchaseOfferId;
                furniInfo.purchaseCouldBeUsedForBuyout = furnitureData.purchaseCouldBeUsedForBuyout;
                furniInfo.rentOfferId = furnitureData.rentOfferId;
                furniInfo.rentCouldBeUsedForBuyout = furnitureData.rentCouldBeUsedForBuyout;
                furniInfo.availableForBuildersClub = furnitureData.availableForBuildersClub;
                furniInfo.tileSizeX = furnitureData.tileSizeX;
                furniInfo.tileSizeY = furnitureData.tileSizeY;
            }
        }

        if(objectType.indexOf('post_it') > -1) furniInfo.isStickie = true;

        const expiryTime = model.getValue<number>(RoomObjectVariable.FURNITURE_EXPIRY_TIME);
        const expiryTimestamp = model.getValue<number>(RoomObjectVariable.FURNITURE_EXPIRTY_TIMESTAMP);

        furniInfo.expiration = ((expiryTime < 0) ? expiryTime : Math.max(0, (expiryTime - ((GetTickerTime() - expiryTimestamp) / 1000))));

        let roomObjectImage = GetRoomEngine().getRoomObjectImage(roomSession.roomId, objectId, category, new Vector3d(180), 64, null);

        if(!roomObjectImage.data || (roomObjectImage.data.width > 140) || (roomObjectImage.data.height > 200))
        {
            roomObjectImage = GetRoomEngine().getRoomObjectImage(roomSession.roomId, objectId, category, new Vector3d(180), 1, null);
        }

        furniInfo.image = roomObjectImage.getImage();
        furniInfo.isWallItem = (category === RoomObjectCategory.WALL);
        furniInfo.isRoomOwner = roomSession.isRoomOwner;
        furniInfo.roomControllerLevel = roomSession.controllerLevel;
        furniInfo.isAnyRoomController = GetSessionDataManager().isModerator;
        furniInfo.ownerId = model.getValue<number>(RoomObjectVariable.FURNITURE_OWNER_ID);
        furniInfo.ownerName = model.getValue<string>(RoomObjectVariable.FURNITURE_OWNER_NAME);
        furniInfo.usagePolicy = model.getValue<number>(RoomObjectVariable.FURNITURE_USAGE_POLICY);

        const guildId = model.getValue<number>(RoomObjectVariable.FURNITURE_GUILD_CUSTOMIZED_GUILD_ID);

        if(guildId !== 0)
        {
            furniInfo.groupId = guildId;
            //this.container.connection.send(new _Str_2863(guildId, false));
        }

        if(IsOwnerOfFurniture(roomObject)) furniInfo.isOwner = true;

        return furniInfo;
    }

    public static getUserInfo(category: number, userData: IRoomUserData): AvatarInfoUser
    {
        const roomSession = GetRoomSession();

        let userInfoType = AvatarInfoUser.OWN_USER;

        if(userData.webID !== GetSessionDataManager().userId) userInfoType = AvatarInfoUser.PEER;

        const userInfo = new AvatarInfoUser(userInfoType);

        userInfo.isSpectatorMode = roomSession.isSpectator;
        userInfo.name = userData.name;
        userInfo.motto = userData.custom;
        userInfo.achievementScore = userData.activityPoints;
        userInfo.webID = userData.webID;
        userInfo.roomIndex = userData.roomIndex;
        userInfo.userType = RoomObjectType.USER;

        const roomObject = GetRoomEngine().getRoomObject(roomSession.roomId, userData.roomIndex, category);

        if(roomObject) userInfo.carryItem = (roomObject.model.getValue<number>(RoomObjectVariable.FIGURE_CARRY_OBJECT) || 0);

        if(userInfoType === AvatarInfoUser.OWN_USER) userInfo.allowNameChange = GetSessionDataManager().canChangeName;

        userInfo.amIOwner = roomSession.isRoomOwner;
        userInfo.isGuildRoom = roomSession.isGuildRoom;
        userInfo.roomControllerLevel = roomSession.controllerLevel;
        userInfo.amIAnyRoomController = GetSessionDataManager().isModerator;
        userInfo.isAmbassador = GetSessionDataManager().isAmbassador;

        if(userInfoType === AvatarInfoUser.PEER)
        {
            if(roomObject)
            {
                const flatControl = roomObject.model.getValue<number>(RoomObjectVariable.FIGURE_FLAT_CONTROL);

                if(flatControl !== null) userInfo.targetRoomControllerLevel = flatControl;

                userInfo.canBeMuted = this.canBeMuted(userInfo);
                userInfo.canBeKicked = this.canBeKicked(userInfo);
                userInfo.canBeBanned = this.canBeBanned(userInfo);
            }

            userInfo.isIgnored = GetSessionDataManager().isUserIgnored(userData.name);
            userInfo.respectLeft = GetSessionDataManager().respectsLeft;

            const isShuttingDown = GetSessionDataManager().isSystemShutdown;
            const tradeMode = roomSession.tradeMode;

            if(isShuttingDown)
            {
                userInfo.canTrade = false;
            }
            else
            {
                switch(tradeMode)
                {
                    case RoomTradingLevelEnum.ROOM_CONTROLLER_REQUIRED: {
                        const roomController = ((userInfo.roomControllerLevel !== RoomControllerLevel.NONE) && (userInfo.roomControllerLevel !== RoomControllerLevel.GUILD_MEMBER));
                        const targetController = ((userInfo.targetRoomControllerLevel !== RoomControllerLevel.NONE) && (userInfo.targetRoomControllerLevel !== RoomControllerLevel.GUILD_MEMBER));

                        userInfo.canTrade = (roomController || targetController);
                        break;
                    }
                    case RoomTradingLevelEnum.NO_TRADING:
                        userInfo.canTrade = true;
                        break;
                    default:
                        userInfo.canTrade = false;
                        break;
                }
            }

            userInfo.canTradeReason = AvatarInfoUser.TRADE_REASON_OK;

            if(isShuttingDown) userInfo.canTradeReason = AvatarInfoUser.TRADE_REASON_SHUTDOWN;

            if(tradeMode !== RoomTradingLevelEnum.FREE_TRADING) userInfo.canTradeReason = AvatarInfoUser.TRADE_REASON_NO_TRADING;

            // const _local_12 = GetSessionDataManager().userId;
            // _local_13 = GetSessionDataManager()._Str_18437(_local_12);
            // this._Str_16287(_local_12, _local_13);
        }

        userInfo.groupId = userData.groupId;
        userInfo.groupBadgeId = GetSessionDataManager().getGroupBadge(userInfo.groupId);
        userInfo.groupName = userData.groupName;
        userInfo.badges = roomSession.userDataManager.getUserBadges(userData.webID);
        userInfo.figure = userData.figure;
        //var _local_8:Array = GetSessionDataManager()._Str_18437(userData.webID);
        //this._Str_16287(userData._Str_2394, _local_8);
        //this._container._Str_8097._Str_14387(userData.webID);
        //this._container.connection.send(new _Str_8049(userData._Str_2394));

        return userInfo;
    }

    public static getBotInfo(category: number, userData: IRoomUserData): AvatarInfoUser
    {
        const roomSession = GetRoomSession();
        const userInfo = new AvatarInfoUser(AvatarInfoUser.BOT);

        userInfo.name = userData.name;
        userInfo.motto = userData.custom;
        userInfo.webID = userData.webID;
        userInfo.roomIndex = userData.roomIndex;
        userInfo.userType = userData.type;

        const roomObject = GetRoomEngine().getRoomObject(roomSession.roomId, userData.roomIndex, category);

        if(roomObject) userInfo.carryItem = (roomObject.model.getValue<number>(RoomObjectVariable.FIGURE_CARRY_OBJECT) || 0);

        userInfo.amIOwner = roomSession.isRoomOwner;
        userInfo.isGuildRoom = roomSession.isGuildRoom;
        userInfo.roomControllerLevel = roomSession.controllerLevel;
        userInfo.amIAnyRoomController = GetSessionDataManager().isModerator;
        userInfo.isAmbassador = GetSessionDataManager().isAmbassador;
        userInfo.badges = [ AvatarInfoUser.DEFAULT_BOT_BADGE_ID ];
        userInfo.figure = userData.figure;

        return userInfo;
    }

    public static getRentableBotInfo(category: number, userData: IRoomUserData): AvatarInfoRentableBot
    {
        const roomSession = GetRoomSession();
        const botInfo = new AvatarInfoRentableBot(AvatarInfoRentableBot.RENTABLE_BOT);

        botInfo.name = userData.name;
        botInfo.motto = userData.custom;
        botInfo.webID = userData.webID;
        botInfo.roomIndex = userData.roomIndex;
        botInfo.ownerId = userData.ownerId;
        botInfo.ownerName = userData.ownerName;
        botInfo.botSkills = userData.botSkills;

        const roomObject = GetRoomEngine().getRoomObject(roomSession.roomId, userData.roomIndex, category);

        if(roomObject) botInfo.carryItem = (roomObject.model.getValue<number>(RoomObjectVariable.FIGURE_CARRY_OBJECT) || 0);

        botInfo.amIOwner = roomSession.isRoomOwner;
        botInfo.roomControllerLevel = roomSession.controllerLevel;
        botInfo.amIAnyRoomController = GetSessionDataManager().isModerator;
        botInfo.badges = [ AvatarInfoUser.DEFAULT_BOT_BADGE_ID ];
        botInfo.figure = userData.figure;

        return botInfo;
    }

    public static getPetInfo(petData: IRoomPetData): AvatarInfoPet
    {
        const roomSession = GetRoomSession();
        const userData = roomSession.userDataManager.getPetData(petData.id);

        if(!userData) return;

        const figure = new PetFigureData(userData.figure);

        let posture: string = null;

        if(figure.typeId === PetType.MONSTERPLANT)
        {
            if(petData.level >= petData.adultLevel) posture = 'std';
            else posture = ('grw' + petData.level);
        }

        const isOwner = (petData.ownerId === GetSessionDataManager().userId);
        const petInfo = new AvatarInfoPet(AvatarInfoPet.PET_INFO);

        petInfo.name = userData.name;
        petInfo.id = petData.id;
        petInfo.ownerId = petData.ownerId;
        petInfo.ownerName = petData.ownerName;
        petInfo.rarityLevel = petData.rarityLevel;
        petInfo.petType = figure.typeId;
        petInfo.petBreed = figure.paletteId;
        petInfo.petFigure = userData.figure;
        petInfo.posture = posture;
        petInfo.isOwner = isOwner;
        petInfo.roomIndex = userData.roomIndex;
        petInfo.level = petData.level;
        petInfo.maximumLevel = petData.maximumLevel;
        petInfo.experience = petData.experience;
        petInfo.levelExperienceGoal = petData.levelExperienceGoal;
        petInfo.energy = petData.energy;
        petInfo.maximumEnergy = petData.maximumEnergy;
        petInfo.happyness = petData.happyness;
        petInfo.maximumHappyness = petData.maximumHappyness;
        petInfo.respect = petData.respect;
        petInfo.respectsPetLeft = GetSessionDataManager().respectsPetLeft;
        petInfo.age = petData.age;
        petInfo.saddle = petData.saddle;
        petInfo.rider = petData.rider;
        petInfo.breedable = petData.breedable;
        petInfo.fullyGrown = petData.fullyGrown;
        petInfo.dead = petData.dead;
        petInfo.rarityLevel = petData.rarityLevel;
        petInfo.skillTresholds = petData.skillTresholds;
        petInfo.canRemovePet = false;
        petInfo.publiclyRideable = petData.publiclyRideable;
        petInfo.maximumTimeToLive = petData.maximumTimeToLive;
        petInfo.remainingTimeToLive = petData.remainingTimeToLive;
        petInfo.remainingGrowTime = petData.remainingGrowTime;
        petInfo.publiclyBreedable = petData.publiclyBreedable;

        if(isOwner || roomSession.isRoomOwner || GetSessionDataManager().isModerator || (roomSession.controllerLevel >= RoomControllerLevel.GUEST)) petInfo.canRemovePet = true;

        return petInfo;
    }

    private static checkGuildSetting(userInfo: AvatarInfoUser): boolean
    {
        if(userInfo.isGuildRoom) return (userInfo.roomControllerLevel >= RoomControllerLevel.GUILD_ADMIN);

        return (userInfo.roomControllerLevel >= RoomControllerLevel.GUEST);
    }

    private static isValidSetting(userInfo: AvatarInfoUser, checkSetting: (userInfo: AvatarInfoUser, moderation: IRoomModerationSettings) => boolean): boolean
    {
        const roomSession = GetRoomSession();

        if(!roomSession.isPrivateRoom) return false;

        const moderation = roomSession.moderationSettings;

        let flag = false;

        if(moderation) flag = checkSetting(userInfo, moderation);

        return (flag && (userInfo.targetRoomControllerLevel < RoomControllerLevel.ROOM_OWNER));
    }

    private static canBeMuted(userInfo: AvatarInfoUser): boolean
    {
        const checkSetting = (userInfo: AvatarInfoUser, moderation: IRoomModerationSettings) =>
        {
            switch(moderation.allowMute)
            {
                case RoomModerationSettings.MODERATION_LEVEL_USER_WITH_RIGHTS:
                    return this.checkGuildSetting(userInfo);
                default:
                    return (userInfo.roomControllerLevel >= RoomControllerLevel.ROOM_OWNER);
            }
        }

        return this.isValidSetting(userInfo, checkSetting);
    }

    private static canBeKicked(userInfo: AvatarInfoUser): boolean
    {
        const checkSetting = (userInfo: AvatarInfoUser, moderation: IRoomModerationSettings) =>
        {
            switch(moderation.allowKick)
            {
                case RoomModerationSettings.MODERATION_LEVEL_ALL:
                    return true;
                case RoomModerationSettings.MODERATION_LEVEL_USER_WITH_RIGHTS:
                    return this.checkGuildSetting(userInfo);
                default:
                    return (userInfo.roomControllerLevel >= RoomControllerLevel.ROOM_OWNER);
            }
        }

        return this.isValidSetting(userInfo, checkSetting);
    }

    private static canBeBanned(userInfo: AvatarInfoUser): boolean
    {
        const checkSetting = (userInfo: AvatarInfoUser, moderation: IRoomModerationSettings) =>
        {
            switch(moderation.allowBan)
            {
                case RoomModerationSettings.MODERATION_LEVEL_USER_WITH_RIGHTS:
                    return this.checkGuildSetting(userInfo);
                default:
                    return (userInfo.roomControllerLevel >= RoomControllerLevel.ROOM_OWNER);
            }
        }

        return this.isValidSetting(userInfo, checkSetting);
    }
}
