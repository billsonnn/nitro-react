import { IFurnitureData, NitroEvent, ObjectDataFactory, PetFigureData, PetRespectComposer, PetSupplementComposer, PetType, RoomControllerLevel, RoomModerationSettings, RoomObjectCategory, RoomObjectOperationType, RoomObjectType, RoomObjectVariable, RoomSessionPetInfoUpdateEvent, RoomSessionUserBadgesEvent, RoomTradingLevelEnum, RoomUnitDropHandItemComposer, RoomUnitGiveHandItemComposer, RoomUnitGiveHandItemPetComposer, RoomUserData, RoomWidgetEnum, RoomWidgetEnumItemExtradataParameter, Vector3d } from '@nitrots/nitro-renderer';
import { GetNitroInstance, GetRoomEngine, GetSessionDataManager, IsOwnerOfFurniture } from '../../../..';
import { InventoryTradeRequestEvent, WiredSelectObjectEvent } from '../../../../../events';
import { FriendsSendFriendRequestEvent } from '../../../../../events/friends/FriendsSendFriendRequestEvent';
import { HelpReportUserEvent } from '../../../../../events/help/HelpReportUserEvent';
import { dispatchUiEvent } from '../../../../../hooks/events';
import { SendMessageHook } from '../../../../../hooks/messages';
import { FriendsHelper } from '../../../../../views/friends/common/FriendsHelper';
import { PetSupplementEnum } from '../../../../../views/room/widgets/avatar-info/common/PetSupplementEnum';
import { LocalizeText } from '../../../../utils/LocalizeText';
import { RoomWidgetObjectNameEvent, RoomWidgetUpdateChatInputContentEvent, RoomWidgetUpdateEvent, RoomWidgetUpdateInfostandFurniEvent, RoomWidgetUpdateInfostandPetEvent, RoomWidgetUpdateInfostandRentableBotEvent, RoomWidgetUpdateInfostandUserEvent } from '../events';
import { RoomWidgetChangeMottoMessage, RoomWidgetFurniActionMessage, RoomWidgetMessage, RoomWidgetRoomObjectMessage, RoomWidgetUserActionMessage } from '../messages';
import { RoomWidgetHandler } from './RoomWidgetHandler';

export class RoomWidgetInfostandHandler extends RoomWidgetHandler
{
    public processEvent(event: NitroEvent): void
    {
        switch(event.type)
        {
            case RoomSessionPetInfoUpdateEvent.PET_INFO:
                this.processPetInfoEvent((event as RoomSessionPetInfoUpdateEvent));
                return;
            case RoomSessionUserBadgesEvent.RSUBE_BADGES:
                this.container.eventDispatcher.dispatchEvent(event);
                return;
        }
    }

    public processWidgetMessage(message: RoomWidgetMessage): RoomWidgetUpdateEvent
    {
        let userId = 0;
        let userData: RoomUserData = null;
        let objectId = 0;
        let category = 0;

        if(message instanceof RoomWidgetUserActionMessage)
        {
            userId = message.userId;

            const petMessages = [
                RoomWidgetUserActionMessage.REQUEST_PET_UPDATE,
                RoomWidgetUserActionMessage.RESPECT_PET,
                RoomWidgetUserActionMessage.PICKUP_PET,
                RoomWidgetUserActionMessage.MOUNT_PET,
                RoomWidgetUserActionMessage.TOGGLE_PET_RIDING_PERMISSION,
                RoomWidgetUserActionMessage.TOGGLE_PET_BREEDING_PERMISSION,
                RoomWidgetUserActionMessage.DISMOUNT_PET,
                RoomWidgetUserActionMessage.SADDLE_OFF,
                RoomWidgetUserActionMessage.GIVE_CARRY_ITEM_TO_PET,
                RoomWidgetUserActionMessage.GIVE_WATER_TO_PET,
                RoomWidgetUserActionMessage.GIVE_LIGHT_TO_PET,
                RoomWidgetUserActionMessage.TREAT_PET
            ];

            if(petMessages.indexOf(message.type) >= 0)
            {
                userData = this.container.roomSession.userDataManager.getPetData(userId);
            }
            else
            {
                userData = this.container.roomSession.userDataManager.getUserData(userId);
            }

            if(!userData) return null;
        }

        else if(message instanceof RoomWidgetFurniActionMessage)
        {
            objectId = message.furniId;
            category = message.furniCategory;
        }

        switch(message.type)
        {
            case RoomWidgetRoomObjectMessage.GET_OBJECT_NAME:
                return this.processObjectNameMessage((message as RoomWidgetRoomObjectMessage));
            case RoomWidgetRoomObjectMessage.GET_OBJECT_INFO:
                return this.processObjectInfoMessage((message as RoomWidgetRoomObjectMessage));
            case RoomWidgetUserActionMessage.SEND_FRIEND_REQUEST:
                dispatchUiEvent(new FriendsSendFriendRequestEvent(userData.webID, userData.name));
                break;
            case RoomWidgetUserActionMessage.RESPECT_USER:
                GetSessionDataManager().giveRespect(userId);
                break;
            case RoomWidgetUserActionMessage.RESPECT_PET:
                GetSessionDataManager().givePetRespect(userId);
                break;
            case RoomWidgetUserActionMessage.WHISPER_USER:
                this.container.eventDispatcher.dispatchEvent(new RoomWidgetUpdateChatInputContentEvent(RoomWidgetUpdateChatInputContentEvent.WHISPER, userData.name));
                break;
            case RoomWidgetUserActionMessage.IGNORE_USER:
                GetSessionDataManager().ignoreUser(userData.name);
                break;
            case RoomWidgetUserActionMessage.UNIGNORE_USER:
                GetSessionDataManager().unignoreUser(userData.name);
                break;
            case RoomWidgetUserActionMessage.KICK_USER:
                this.container.roomSession.sendKickMessage((message as RoomWidgetUserActionMessage).userId);
                break;
            case RoomWidgetUserActionMessage.BAN_USER_DAY:
            case RoomWidgetUserActionMessage.BAN_USER_HOUR:
            case RoomWidgetUserActionMessage.BAN_USER_PERM:
                this.container.roomSession.sendBanMessage((message as RoomWidgetUserActionMessage).userId, message.type);
                break;
            case RoomWidgetUserActionMessage.MUTE_USER_2MIN:
                this.container.roomSession.sendMuteMessage((message as RoomWidgetUserActionMessage).userId, 2);
                break;
            case RoomWidgetUserActionMessage.MUTE_USER_5MIN:
                this.container.roomSession.sendMuteMessage((message as RoomWidgetUserActionMessage).userId, 5);
                break;
            case RoomWidgetUserActionMessage.MUTE_USER_10MIN:
                this.container.roomSession.sendMuteMessage((message as RoomWidgetUserActionMessage).userId, 10);
                break;
            case RoomWidgetUserActionMessage.GIVE_RIGHTS:
                this.container.roomSession.sendGiveRightsMessage((message as RoomWidgetUserActionMessage).userId);
                break;
            case RoomWidgetUserActionMessage.TAKE_RIGHTS:
                this.container.roomSession.sendTakeRightsMessage((message as RoomWidgetUserActionMessage).userId);
                break;
            case RoomWidgetUserActionMessage.START_TRADING:
                dispatchUiEvent(new InventoryTradeRequestEvent(userData.roomIndex, userData.name));
                break;
            // case RoomWidgetUserActionMessage.RWUAM_OPEN_HOME_PAGE:
            //     this._container.sessionDataManager._Str_21275((message as RoomWidgetUserActionMessage).userId, _local_3.name);
            //     break;
            case RoomWidgetUserActionMessage.PICKUP_PET:
                this.container.roomSession.pickupPet(userId);
                break;
            case RoomWidgetUserActionMessage.MOUNT_PET:
                this.container.roomSession.mountPet(userId);
                break;
            case RoomWidgetUserActionMessage.TOGGLE_PET_RIDING_PERMISSION:
                this.container.roomSession.togglePetRiding(userId);
                break;
            case RoomWidgetUserActionMessage.TOGGLE_PET_BREEDING_PERMISSION:
                this.container.roomSession.togglePetBreeding(userId);
                break;
            case RoomWidgetUserActionMessage.DISMOUNT_PET:
                this.container.roomSession.dismountPet(userId);
                break;
            case RoomWidgetUserActionMessage.SADDLE_OFF:
                this.container.roomSession.removePetSaddle(userId);
                break;
            case RoomWidgetUserActionMessage.PASS_CARRY_ITEM:
                SendMessageHook(new RoomUnitGiveHandItemComposer(userId));
                break;
            case RoomWidgetUserActionMessage.GIVE_CARRY_ITEM_TO_PET:
                SendMessageHook(new RoomUnitGiveHandItemPetComposer(userId));
                break;
            case RoomWidgetUserActionMessage.GIVE_WATER_TO_PET:
                SendMessageHook(new PetSupplementComposer(userId, PetSupplementEnum.WATER));
                break;
            case RoomWidgetUserActionMessage.GIVE_LIGHT_TO_PET:
                SendMessageHook(new PetSupplementComposer(userId, PetSupplementEnum.LIGHT));
                break;
            case RoomWidgetUserActionMessage.TREAT_PET:
                SendMessageHook(new PetRespectComposer(userId));
                break;
            case RoomWidgetUserActionMessage.DROP_CARRY_ITEM:
                SendMessageHook(new RoomUnitDropHandItemComposer());
                break;
            case RoomWidgetUserActionMessage.REQUEST_PET_UPDATE:
                this.container.roomSession.userDataManager.requestPetInfo(userId);
                return;
            case RoomWidgetUserActionMessage.REPORT:
                return;
            case RoomWidgetUserActionMessage.REPORT_CFH_OTHER:
                dispatchUiEvent(new HelpReportUserEvent(userId));
                return;
            case RoomWidgetUserActionMessage.AMBASSADOR_ALERT_USER:
                this.container.roomSession.sendAmbassadorAlertMessage(userId);
                return;
            case RoomWidgetUserActionMessage.AMBASSADOR_KICK_USER:
                this.container.roomSession.sendKickMessage(userId);
                return;
            case RoomWidgetUserActionMessage.AMBASSADOR_MUTE_USER_2MIN:
                this.container.roomSession.sendMuteMessage(userId, 2);
                return;
            case RoomWidgetUserActionMessage.AMBASSADOR_MUTE_USER_10MIN:
                this.container.roomSession.sendMuteMessage(userId, 10);
                return;
            case RoomWidgetUserActionMessage.AMBASSADOR_MUTE_USER_60MIN:
                this.container.roomSession.sendMuteMessage(userId, 60);
                return;
            case RoomWidgetUserActionMessage.AMBASSADOR_MUTE_USER_18HOUR:
                this.container.roomSession.sendMuteMessage(userId, 1080);
                return;
            case RoomWidgetFurniActionMessage.ROTATE:
                GetRoomEngine().processRoomObjectOperation(objectId, category, RoomObjectOperationType.OBJECT_ROTATE_POSITIVE);
                return;
            case RoomWidgetFurniActionMessage.MOVE:
                GetRoomEngine().processRoomObjectOperation(objectId, category, RoomObjectOperationType.OBJECT_MOVE);
                return;
            case RoomWidgetFurniActionMessage.PICKUP:
                GetRoomEngine().processRoomObjectOperation(objectId, category, RoomObjectOperationType.OBJECT_PICKUP);
                return;
            case RoomWidgetFurniActionMessage.EJECT:
                GetRoomEngine().processRoomObjectOperation(objectId, category, RoomObjectOperationType.OBJECT_EJECT);
                return;
            case RoomWidgetFurniActionMessage.USE:
                GetRoomEngine().useRoomObject(objectId, category);
                return;
            case RoomWidgetFurniActionMessage.SAVE_STUFF_DATA: {
                const furniMessage = (message as RoomWidgetFurniActionMessage);

                if(!furniMessage.objectData) return;
                
                const mapData = new Map<string, string>();
                const dataParts = furniMessage.objectData.split('\t');

                if(dataParts)
                {
                    for(const part of dataParts)
                    {
                        const [ key, value ] = part.split('=', 2);
                        
                        mapData.set(key, value);
                    }
                }

                GetRoomEngine().modifyRoomObjectDataWithMap(objectId, category, RoomObjectOperationType.OBJECT_SAVE_STUFF_DATA, mapData);

                return;
            }
            case RoomWidgetChangeMottoMessage.CHANGE_MOTTO:
                this.container.roomSession.sendMottoMessage((message as RoomWidgetChangeMottoMessage).motto);
                return;
        }

        return null;
    }

    private processObjectNameMessage(message: RoomWidgetRoomObjectMessage): RoomWidgetUpdateEvent
    {
        let id = -1;
        let name: string = null;
        let userType = 0;

        switch(message.category)
        {
            case RoomObjectCategory.FLOOR:
            case RoomObjectCategory.WALL: {
                const roomObject = GetRoomEngine().getRoomObject(this.container.roomSession.roomId, message.id, message.category);

                if(!roomObject) break;

                if(roomObject.type.indexOf('poster') === 0)
                {
                    name = LocalizeText('${poster_' + parseInt(roomObject.type.replace('poster', '')) + '_name}');
                }
                else
                {
                    let furniData: IFurnitureData = null;

                    const typeId = roomObject.model.getValue<number>(RoomObjectVariable.FURNITURE_TYPE_ID);

                    if(message.category === RoomObjectCategory.FLOOR)
                    {
                        furniData = GetSessionDataManager().getFloorItemData(typeId);
                    }

                    else if(message.category === RoomObjectCategory.WALL)
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
                const userData = this.container.roomSession.userDataManager.getUserDataByIndex(message.id);

                if(!userData) break;

                id = userData.webID;
                name = userData.name;
                userType = userData.type;
                break;
            }
        }

        if(name) this.container.eventDispatcher.dispatchEvent(new RoomWidgetObjectNameEvent(RoomWidgetObjectNameEvent.TYPE, message.id, message.category, id, name, userType));

        return null;
    }

    private processObjectInfoMessage(message: RoomWidgetRoomObjectMessage): RoomWidgetUpdateEvent
    {
        const roomId = this.container.roomSession.roomId;

        switch(message.category)
        {
            case RoomObjectCategory.FLOOR:
            case RoomObjectCategory.WALL:
                this.processFurniInfoMessage(message, roomId);
                break;
            case RoomObjectCategory.UNIT: {
                const userData = this.container.roomSession.userDataManager.getUserDataByIndex(message.id);

                if(!userData) break;

                switch(userData.type)
                {
                    case RoomObjectType.PET:
                        this.container.roomSession.userDataManager.requestPetInfo(userData.webID);
                        break;
                    case RoomObjectType.USER:
                        this.processUserInfoMessage(message, roomId, userData);
                        break;
                    case RoomObjectType.BOT:
                        this.processBotInfoMessage(message, roomId, userData);
                        break;
                    case RoomObjectType.RENTABLE_BOT:
                        this.processRentableBotInfoMessage(message, roomId, userData);
                        break;
                }
            }

        }

        return null;
    }

    private processFurniInfoMessage(message: RoomWidgetRoomObjectMessage, roomId: number): void
    {
        const event = new RoomWidgetUpdateInfostandFurniEvent(RoomWidgetUpdateInfostandFurniEvent.FURNI);

        event.id = message.id;
        event.category = message.category;

        const roomObject = GetRoomEngine().getRoomObject(roomId, message.id, message.category);

        if(!roomObject) return;

        const model = roomObject.model;

        if(model.getValue<string>(RoomWidgetEnumItemExtradataParameter.INFOSTAND_EXTRA_PARAM))
        {
            event.extraParam = model.getValue<string>(RoomWidgetEnumItemExtradataParameter.INFOSTAND_EXTRA_PARAM);
        }

        const dataFormat = model.getValue<number>(RoomObjectVariable.FURNITURE_DATA_FORMAT);
        const objectData = ObjectDataFactory.getData(dataFormat);

        objectData.initializeFromRoomObjectModel(model);

        event.stuffData = objectData;

        const objectType = roomObject.type;

        if(objectType.indexOf('poster') === 0)
        {
            const posterId = parseInt(objectType.replace('poster', ''));

            event.name = LocalizeText(('${poster_' + posterId) + '_name}');
            event.description = LocalizeText(('${poster_' + posterId) + '_desc}');
        }
        else
        {
            const typeId = model.getValue<number>(RoomObjectVariable.FURNITURE_TYPE_ID);

            let furnitureData: IFurnitureData = null;

            if(message.category === RoomObjectCategory.FLOOR)
            {
                furnitureData = GetSessionDataManager().getFloorItemData(typeId);
            }

            else if(message.category === RoomObjectCategory.WALL)
            {
                furnitureData = GetSessionDataManager().getWallItemData(typeId);
            }

            if(furnitureData)
            {
                event.name = furnitureData.name;
                event.description = furnitureData.description;
                event.purchaseOfferId = furnitureData.purchaseOfferId;
                event.purchaseCouldBeUsedForBuyout = furnitureData.purchaseCouldBeUsedForBuyout;
                event.rentOfferId = furnitureData.rentOfferId;
                event.rentCouldBeUsedForBuyout = furnitureData.rentCouldBeUsedForBuyout;
                event.availableForBuildersClub = furnitureData.availableForBuildersClub;
                event.tileSizeX = furnitureData.tileSizeX;
                event.tileSizeY = furnitureData.tileSizeY;

                dispatchUiEvent(new WiredSelectObjectEvent(event.id, event.category));
            }
        }

        if(objectType.indexOf('post_it') > -1) event.isStickie = true;

        const expiryTime = model.getValue<number>(RoomObjectVariable.FURNITURE_EXPIRY_TIME);
        const expiryTimestamp = model.getValue<number>(RoomObjectVariable.FURNITURE_EXPIRTY_TIMESTAMP);

        event.expiration = ((expiryTime < 0) ? expiryTime : Math.max(0, (expiryTime - ((GetNitroInstance().time - expiryTimestamp) / 1000))));

        let roomObjectImage = GetRoomEngine().getRoomObjectImage(roomId, message.id, message.category, new Vector3d(180), 64, null);

        if(!roomObjectImage.data || (roomObjectImage.data.width > 140) || (roomObjectImage.data.height > 200))
        {
            roomObjectImage = GetRoomEngine().getRoomObjectImage(roomId, message.id, message.category, new Vector3d(180), 1, null);
        }

        event.image = roomObjectImage.getImage();
        event.isWallItem = (message.category === RoomObjectCategory.WALL);
        event.isRoomOwner = this.container.roomSession.isRoomOwner;
        event.roomControllerLevel = this.container.roomSession.controllerLevel;
        event.isAnyRoomController = GetSessionDataManager().isModerator;
        event.ownerId = model.getValue<number>(RoomObjectVariable.FURNITURE_OWNER_ID);
        event.ownerName = model.getValue<string>(RoomObjectVariable.FURNITURE_OWNER_NAME);
        event.usagePolicy = model.getValue<number>(RoomObjectVariable.FURNITURE_USAGE_POLICY);

        const guildId = model.getValue<number>(RoomObjectVariable.FURNITURE_GUILD_CUSTOMIZED_GUILD_ID);

        if(guildId !== 0)
        {
            event.groupId = guildId;
            //this.container.connection.send(new _Str_2863(guildId, false));
        }

        if(IsOwnerOfFurniture(roomObject)) event.isOwner = true;

        this.container.eventDispatcher.dispatchEvent(event);
    }

    private processUserInfoMessage(message: RoomWidgetRoomObjectMessage, roomId: number, userData: RoomUserData): void
    {
        let eventType = RoomWidgetUpdateInfostandUserEvent.OWN_USER;

        if(userData.webID !== GetSessionDataManager().userId) eventType = RoomWidgetUpdateInfostandUserEvent.PEER;

        const event = new RoomWidgetUpdateInfostandUserEvent(eventType);

        event.isSpectatorMode = this.container.roomSession.isSpectator;
        event.name = userData.name;
        event.motto = userData.custom;
        event.achievementScore = userData.activityPoints;
        event.webID = userData.webID;
        event.roomIndex = userData.roomIndex;
        event.userType = RoomObjectType.USER;

        const roomObject = GetRoomEngine().getRoomObject(roomId, userData.roomIndex, message.category);

        if(roomObject) event.carryItem = (roomObject.model.getValue<number>(RoomObjectVariable.FIGURE_CARRY_OBJECT) || 0);

        if(eventType === RoomWidgetUpdateInfostandUserEvent.OWN_USER)
        {
            event.realName = GetSessionDataManager().realName;
            event.allowNameChange = GetSessionDataManager().canChangeName;
        }

        event.amIOwner = this.container.roomSession.isRoomOwner;
        event.isGuildRoom = this.container.roomSession.isGuildRoom;
        event.roomControllerLevel = this.container.roomSession.controllerLevel;
        event.amIAnyRoomController = GetSessionDataManager().isModerator;
        event.isAmbassador = GetSessionDataManager().isAmbassador;

        if(eventType === RoomWidgetUpdateInfostandUserEvent.PEER)
        {
            event.canBeAskedAsFriend = FriendsHelper.canRequestFriend(userData.webID);

            if(!event.canBeAskedAsFriend)
            {
                const friend = FriendsHelper.getFriend(userData.webID);

                if(friend)
                {
                    event.realName = friend.realName;
                    event.isFriend = true;
                }
            }

            if(roomObject)
            {
                const flatControl = roomObject.model.getValue<number>(RoomObjectVariable.FIGURE_FLAT_CONTROL);

                if(flatControl !== null) event.targetRoomControllerLevel = flatControl;

                event.canBeMuted = this.canBeMuted(event);
                event.canBeKicked = this.canBeKicked(event);
                event.canBeBanned = this.canBeBanned(event);
            }

            event.isIgnored = GetSessionDataManager().isUserIgnored(userData.name);
            event.respectLeft = GetSessionDataManager().respectsLeft;

            const isShuttingDown = GetSessionDataManager().isSystemShutdown;
            const tradeMode = this.container.roomSession.tradeMode;

            if(isShuttingDown)
            {
                event.canTrade = false;
            }
            else
            {
                switch(tradeMode)
                {
                    case RoomTradingLevelEnum.ROOM_CONTROLLER_REQUIRED: {
                        const roomController = ((event.roomControllerLevel !== RoomControllerLevel.NONE) && (event.roomControllerLevel !== RoomControllerLevel.GUILD_MEMBER));
                        const targetController = ((event.targetRoomControllerLevel !== RoomControllerLevel.NONE) && (event.targetRoomControllerLevel !== RoomControllerLevel.GUILD_MEMBER));

                        event.canTrade = (roomController || targetController);
                        break;
                    }
                    case RoomTradingLevelEnum.NO_TRADING:
                        event.canTrade = true;
                        break;
                    default:
                        event.canTrade = false;
                        break;
                }
            }

            event.canTradeReason = RoomWidgetUpdateInfostandUserEvent.TRADE_REASON_OK;

            if(isShuttingDown) event.canTradeReason = RoomWidgetUpdateInfostandUserEvent.TRADE_REASON_SHUTDOWN;

            if(tradeMode !== RoomTradingLevelEnum.FREE_TRADING) event.canTradeReason = RoomWidgetUpdateInfostandUserEvent.TRADE_REASON_NO_TRADING;

            // const _local_12 = GetSessionDataManager().userId;
            // _local_13 = GetSessionDataManager()._Str_18437(_local_12);
            // this._Str_16287(_local_12, _local_13);
        }

        event.groupId = parseInt(userData.guildId);
        event.groupBadgeId = GetSessionDataManager().getGroupBadge(event.groupId);
        event.groupName = userData.groupName;
        event.badges = this.container.roomSession.userDataManager.getUserBadges(userData.webID);
        event.figure = userData.figure;
        //var _local_8:Array = GetSessionDataManager()._Str_18437(userData.webID);
        //this._Str_16287(userData._Str_2394, _local_8);
        //this._container._Str_8097._Str_14387(userData.webID);
        //this._container.connection.send(new _Str_8049(userData._Str_2394));

        this.container.eventDispatcher.dispatchEvent(event);
    }

    private processBotInfoMessage(message: RoomWidgetRoomObjectMessage, roomId: number, userData: RoomUserData): void
    {
        const event = new RoomWidgetUpdateInfostandUserEvent(RoomWidgetUpdateInfostandUserEvent.BOT);

        event.name = userData.name;
        event.motto = userData.custom;
        event.webID = userData.webID;
        event.roomIndex = userData.roomIndex;
        event.userType = userData.type;

        const roomObject = GetRoomEngine().getRoomObject(roomId, userData.roomIndex, message.category);

        if(roomObject) event.carryItem = (roomObject.model.getValue<number>(RoomObjectVariable.FIGURE_CARRY_OBJECT) || 0);

        event.amIOwner = this.container.roomSession.isRoomOwner;
        event.isGuildRoom = this.container.roomSession.isGuildRoom;
        event.roomControllerLevel = this.container.roomSession.controllerLevel;
        event.amIAnyRoomController = GetSessionDataManager().isModerator;
        event.isAmbassador = GetSessionDataManager().isAmbassador;
        event.badges = [ RoomWidgetUpdateInfostandUserEvent.DEFAULT_BOT_BADGE_ID ];
        event.figure = userData.figure;

        this.container.eventDispatcher.dispatchEvent(event);
    }

    private processRentableBotInfoMessage(message: RoomWidgetRoomObjectMessage, roomId: number, userData: RoomUserData): void
    {
        const event = new RoomWidgetUpdateInfostandRentableBotEvent(RoomWidgetUpdateInfostandRentableBotEvent.RENTABLE_BOT);

        event.name = userData.name;
        event.motto = userData.custom;
        event.webID = userData.webID;
        event.roomIndex = userData.roomIndex;
        event.ownerId = userData.ownerId;
        event.ownerName = userData.ownerName;
        event.botSkills = userData.botSkills;

        const roomObject = GetRoomEngine().getRoomObject(roomId, userData.roomIndex, message.category);

        if(roomObject) event.carryItem = (roomObject.model.getValue<number>(RoomObjectVariable.FIGURE_CARRY_OBJECT) || 0);

        event.amIOwner = this.container.roomSession.isRoomOwner;
        event.roomControllerLevel = this.container.roomSession.controllerLevel;
        event.amIAnyRoomController = GetSessionDataManager().isModerator;
        event.badges = [ RoomWidgetUpdateInfostandUserEvent.DEFAULT_BOT_BADGE_ID ];
        event.figure = userData.figure;

        this.container.eventDispatcher.dispatchEvent(event);
    }

    private processPetInfoEvent(event: RoomSessionPetInfoUpdateEvent): void
    {
        const petData = event.petInfo;

        if(!petData) return;

        const roomPetData = this.container.roomSession.userDataManager.getPetData(petData.id);

        if(!roomPetData) return;

        const figure = new PetFigureData(roomPetData.figure);

        let posture: string = null;

        if(figure.typeId === PetType.MONSTERPLANT)
        {
            if(petData.level >= petData.adultLevel) posture = 'std';
            else posture = ('grw' + petData.level);
        }

        const isOwner = (petData.ownerId === GetSessionDataManager().userId);
        const infostandEvent = new RoomWidgetUpdateInfostandPetEvent(RoomWidgetUpdateInfostandPetEvent.PET_INFO);

        infostandEvent.name = roomPetData.name;
        infostandEvent.id = petData.id;
        infostandEvent.ownerId = petData.ownerId;
        infostandEvent.ownerName = petData.ownerName;
        infostandEvent.rarityLevel = petData.rarityLevel;
        infostandEvent.petType = figure.typeId;
        infostandEvent.petBreed = figure.paletteId;
        infostandEvent.petFigure = roomPetData.figure;
        infostandEvent.posture = posture;
        infostandEvent.isOwner = isOwner;
        infostandEvent.roomIndex = roomPetData.roomIndex;
        infostandEvent.level = petData.level;
        infostandEvent.maximumLevel = petData.maximumLevel;
        infostandEvent.experience = petData.experience;
        infostandEvent.levelExperienceGoal = petData.levelExperienceGoal;
        infostandEvent.energy = petData.energy;
        infostandEvent.maximumEnergy = petData.maximumEnergy;
        infostandEvent.happyness = petData.happyness;
        infostandEvent.maximumHappyness = petData.maximumHappyness;
        infostandEvent.respect = petData.respect;
        infostandEvent.respectsPetLeft = GetSessionDataManager().respectsPetLeft;
        infostandEvent.age = petData.age;
        infostandEvent.saddle = petData.saddle;
        infostandEvent.rider = petData.rider;
        infostandEvent.breedable = petData.breedable;
        infostandEvent.fullyGrown = petData.fullyGrown;
        infostandEvent.dead = petData.dead;
        infostandEvent.rarityLevel = petData.rarityLevel;
        infostandEvent.skillTresholds = petData.skillTresholds;
        infostandEvent.canRemovePet = false;
        infostandEvent.publiclyRideable = petData.publiclyRideable;
        infostandEvent.maximumTimeToLive = petData.maximumTimeToLive;
        infostandEvent.remainingTimeToLive = petData.remainingTimeToLive;
        infostandEvent.remainingGrowTime = petData.remainingGrowTime;
        infostandEvent.publiclyBreedable = petData.publiclyBreedable;

        if(isOwner)
        {
            infostandEvent.canRemovePet = true;
        }
        else
        {
            if(this.container.roomSession.isRoomOwner || GetSessionDataManager().isModerator || (this.container.roomSession.controllerLevel >= RoomControllerLevel.GUEST)) infostandEvent.canRemovePet = true;
        }

        this.container.eventDispatcher.dispatchEvent(infostandEvent);
    }

    private checkGuildSetting(event: RoomWidgetUpdateInfostandUserEvent): boolean
    {
        if(event.isGuildRoom) return (event.roomControllerLevel >= RoomControllerLevel.GUILD_ADMIN);

        return (event.roomControllerLevel >= RoomControllerLevel.GUEST);
    }

    private canBeMuted(event: RoomWidgetUpdateInfostandUserEvent): boolean
    {
        const checkSetting = (event: RoomWidgetUpdateInfostandUserEvent, moderation: RoomModerationSettings) =>
        {
            switch(moderation.allowMute)
            {
                case RoomModerationSettings.MODERATION_LEVEL_USER_WITH_RIGHTS:
                    return this.checkGuildSetting(event);
                default:
                    return (event.roomControllerLevel >= RoomControllerLevel.ROOM_OWNER);
            }
        }

        return this.isValidSetting(event, checkSetting);
    }

    private canBeKicked(event: RoomWidgetUpdateInfostandUserEvent): boolean
    {
        const checkSetting = (event: RoomWidgetUpdateInfostandUserEvent, moderation: RoomModerationSettings) =>
        {
            switch(moderation.allowKick)
            {
                case RoomModerationSettings.MODERATION_LEVEL_ALL:
                    return true;
                case RoomModerationSettings.MODERATION_LEVEL_USER_WITH_RIGHTS:
                    return this.checkGuildSetting(event);
                default:
                    return (event.roomControllerLevel >= RoomControllerLevel.ROOM_OWNER);
            }
        }

        return this.isValidSetting(event, checkSetting);
    }

    private canBeBanned(event: RoomWidgetUpdateInfostandUserEvent): boolean
    {
        const checkSetting = (event: RoomWidgetUpdateInfostandUserEvent, moderation: RoomModerationSettings) =>
        {
            switch(moderation.allowBan)
            {
                case RoomModerationSettings.MODERATION_LEVEL_USER_WITH_RIGHTS:
                    return this.checkGuildSetting(event);
                default:
                    return (event.roomControllerLevel >= RoomControllerLevel.ROOM_OWNER);
            }
        }

        return this.isValidSetting(event, checkSetting);
    }

    private isValidSetting(event: RoomWidgetUpdateInfostandUserEvent, checkSetting: (event: RoomWidgetUpdateInfostandUserEvent, moderation: RoomModerationSettings) => boolean): boolean
    {
        if(!this.container.roomSession._Str_7411) return false;

        const moderation = this.container.roomSession.moderationSettings;

        let flag = false;

        if(moderation) flag = checkSetting(event, moderation);

        return (flag && (event.roomControllerLevel < RoomControllerLevel.ROOM_OWNER));
    }

    private getPetType(figure: string): number
    {
        return this.getPetFigurePart(figure, 0);
    }

    private getPetBreed(figure: string): number
    {
        return this.getPetFigurePart(figure, 1);
    }

    private getPetColor(figure: string): number
    {
        return this.getPetFigurePart(figure, 2);
    }

    private getPetFigurePart(figure: string, index: number): number
    {
        if(!figure || !figure.length) return -1;

        const parts = figure.split(' ');

        if(parts.length > 0) return parseInt(parts[index]);

        return -1;
    }

    public get type(): string
    {
        return RoomWidgetEnum.INFOSTAND;
    }

    public get eventTypes(): string[]
    {
        return [
            RoomSessionPetInfoUpdateEvent.PET_INFO,
            RoomSessionUserBadgesEvent.RSUBE_BADGES
        ];
    }

    public get messageTypes(): string[]
    {
        return [
            RoomWidgetRoomObjectMessage.GET_OBJECT_INFO,
            RoomWidgetRoomObjectMessage.GET_OBJECT_NAME,
            RoomWidgetUserActionMessage.SEND_FRIEND_REQUEST,
            RoomWidgetUserActionMessage.RESPECT_USER,
            RoomWidgetUserActionMessage.WHISPER_USER,
            RoomWidgetUserActionMessage.IGNORE_USER,
            RoomWidgetUserActionMessage.UNIGNORE_USER,
            RoomWidgetUserActionMessage.KICK_USER,
            RoomWidgetUserActionMessage.BAN_USER_DAY,
            RoomWidgetUserActionMessage.BAN_USER_HOUR,
            RoomWidgetUserActionMessage.BAN_USER_PERM,
            RoomWidgetUserActionMessage.MUTE_USER_2MIN,
            RoomWidgetUserActionMessage.MUTE_USER_5MIN,
            RoomWidgetUserActionMessage.MUTE_USER_10MIN,
            RoomWidgetUserActionMessage.GIVE_RIGHTS,
            RoomWidgetUserActionMessage.TAKE_RIGHTS,
            RoomWidgetUserActionMessage.START_TRADING,
            RoomWidgetUserActionMessage.OPEN_HOME_PAGE,
            RoomWidgetUserActionMessage.PASS_CARRY_ITEM,
            RoomWidgetUserActionMessage.GIVE_CARRY_ITEM_TO_PET,
            RoomWidgetUserActionMessage.DROP_CARRY_ITEM,
            RoomWidgetUserActionMessage.REPORT,
            RoomWidgetUserActionMessage.PICKUP_PET,
            RoomWidgetUserActionMessage.MOUNT_PET,
            RoomWidgetUserActionMessage.TOGGLE_PET_RIDING_PERMISSION,
            RoomWidgetUserActionMessage.TOGGLE_PET_BREEDING_PERMISSION,
            RoomWidgetUserActionMessage.DISMOUNT_PET,
            RoomWidgetUserActionMessage.SADDLE_OFF,
            RoomWidgetUserActionMessage.TRAIN_PET,
            RoomWidgetUserActionMessage.RESPECT_PET,
            RoomWidgetUserActionMessage.REQUEST_PET_UPDATE,
            RoomWidgetUserActionMessage.GIVE_LIGHT_TO_PET,
            RoomWidgetUserActionMessage.GIVE_WATER_TO_PET,
            RoomWidgetUserActionMessage.TREAT_PET,
            RoomWidgetUserActionMessage.REPORT_CFH_OTHER,
            RoomWidgetUserActionMessage.AMBASSADOR_ALERT_USER,
            RoomWidgetUserActionMessage.AMBASSADOR_KICK_USER,
            RoomWidgetUserActionMessage.AMBASSADOR_MUTE_USER_2MIN,
            RoomWidgetUserActionMessage.AMBASSADOR_MUTE_USER_10MIN,
            RoomWidgetUserActionMessage.AMBASSADOR_MUTE_USER_60MIN,
            RoomWidgetUserActionMessage.AMBASSADOR_MUTE_USER_18HOUR,
            RoomWidgetChangeMottoMessage.CHANGE_MOTTO,
            RoomWidgetFurniActionMessage.MOVE,
            RoomWidgetFurniActionMessage.ROTATE,
            RoomWidgetFurniActionMessage.EJECT,
            RoomWidgetFurniActionMessage.PICKUP,
            RoomWidgetFurniActionMessage.USE,
            RoomWidgetFurniActionMessage.SAVE_STUFF_DATA
        ];
    }
}
