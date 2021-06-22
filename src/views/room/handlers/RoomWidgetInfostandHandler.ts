import { IFurnitureData, Nitro, NitroEvent, ObjectDataFactory, PetType, RoomAdsUpdateComposer, RoomControllerLevel, RoomModerationParser, RoomObjectCategory, RoomObjectOperationType, RoomObjectType, RoomObjectVariable, RoomSessionPetInfoUpdateEvent, RoomSessionUserBadgesEvent, RoomTradingLevelEnum, RoomUnitDropHandItemComposer, RoomUnitGiveHandItemComposer, RoomUnitGiveHandItemPetComposer, RoomUserData, RoomWidgetEnumItemExtradataParameter, SecurityLevel, Vector3d } from 'nitro-renderer';
import { GetConnection, GetRoomEngine, GetSessionDataManager, IsOwnerOfFurniture } from '../../../api';
import { LocalizeText } from '../../../utils/LocalizeText';
import { RoomWidgetObjectNameEvent, RoomWidgetUpdateEvent, RoomWidgetUpdateInfostandFurniEvent, RoomWidgetUpdateInfostandPetEvent, RoomWidgetUpdateInfostandRentableBotEvent, RoomWidgetUpdateInfostandUserEvent } from '../events';
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
                this.eventDispatcher.dispatchEvent(event);
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
                userData = this.roomSession.userDataManager.getPetData(userId);
            }
            else
            {
                userData = this.roomSession.userDataManager.getUserData(userId);
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
                //this._container.friendService.sendFriendRequest(userId, userData.name);
                break;
            case RoomWidgetUserActionMessage.RESPECT_USER:
                GetSessionDataManager().giveRespect(userId);
                break;
            case RoomWidgetUserActionMessage.RESPECT_PET:
                GetSessionDataManager().givePetRespect(userId);
                break;
            case RoomWidgetUserActionMessage.WHISPER_USER:
                //this.eventDispatcher.dispatchEvent(new RoomWidgetChatInputContentUpdateEvent(RoomWidgetChatInputContentUpdateEvent.WHISPER, userData.name));
                break;
            case RoomWidgetUserActionMessage.IGNORE_USER:
                GetSessionDataManager().ignoreUser(userData.name);
                break;
            case RoomWidgetUserActionMessage.UNIGNORE_USER:
                GetSessionDataManager().unignoreUser(userData.name);
                break;
            case RoomWidgetUserActionMessage.KICK_USER:
                this.roomSession.sendKickMessage((message as RoomWidgetUserActionMessage).userId);
                break;
            case RoomWidgetUserActionMessage.BAN_USER_DAY:
            case RoomWidgetUserActionMessage.BAN_USER_HOUR:
            case RoomWidgetUserActionMessage.BAN_USER_PERM:
                this.roomSession.sendBanMessage((message as RoomWidgetUserActionMessage).userId, message.type);
                break;
            case RoomWidgetUserActionMessage.MUTE_USER_2MIN:
                this.roomSession.sendMuteMessage((message as RoomWidgetUserActionMessage).userId, 2);
                break;
            case RoomWidgetUserActionMessage.MUTE_USER_5MIN:
                this.roomSession.sendMuteMessage((message as RoomWidgetUserActionMessage).userId, 5);
                break;
            case RoomWidgetUserActionMessage.MUTE_USER_10MIN:
                this.roomSession.sendMuteMessage((message as RoomWidgetUserActionMessage).userId, 10);
                break;
            case RoomWidgetUserActionMessage.GIVE_RIGHTS:
                this.roomSession.sendGiveRightsMessage((message as RoomWidgetUserActionMessage).userId);
                break;
            case RoomWidgetUserActionMessage.TAKE_RIGHTS:
                this.roomSession.sendTakeRightsMessage((message as RoomWidgetUserActionMessage).userId);
                break;
            case RoomWidgetUserActionMessage.START_TRADING:
                //if(userData) this._widget.inventoryTrading.startTrade(userData.roomIndex, userData.name);
                break;
            // case RoomWidgetUserActionMessage.RWUAM_OPEN_HOME_PAGE:
            //     this._container.sessionDataManager._Str_21275((message as RoomWidgetUserActionMessage).userId, _local_3.name);
            //     break;
            // case RoomWidgetUserActionMessage.RWUAM_PICKUP_PET:
            //     this._container.roomSession._Str_13781(_local_2);
            //     break;
            // case RoomWidgetUserActionMessage.RWUAM_MOUNT_PET:
            //     this._container.roomSession._Str_21066(_local_2);
            //     break;
            // case RoomWidgetUserActionMessage.RWUAM_TOGGLE_PET_RIDING_PERMISSION:
            //     this._container.roomSession._Str_21025(_local_2);
            //     break;
            // case RoomWidgetUserActionMessage.RWUAM_TOGGLE_PET_BREEDING_PERMISSION:
            //     this._container.roomSession._Str_21562(_local_2);
            //     break;
            // case RoomWidgetUserActionMessage.RWUAM_DISMOUNT_PET:
            //     this._container.roomSession._Str_19075(_local_2);
            //     break;
            // case RoomWidgetUserActionMessage.RWUAM_SADDLE_OFF:
            //     this._container.roomSession._Str_21635(_local_2);
            //     break;
            case RoomWidgetUserActionMessage.PASS_CARRY_ITEM:
                GetConnection().send(new RoomUnitGiveHandItemComposer(userId));
                break;
            case RoomWidgetUserActionMessage.GIVE_CARRY_ITEM_TO_PET:
                GetConnection().send(new RoomUnitGiveHandItemPetComposer(userId));
                break;
            case RoomWidgetUserActionMessage.GIVE_WATER_TO_PET:
                //this._container.connection.send(new _Str_7251(_local_2, PetSupplementEnum._Str_9473));
                break;
            case RoomWidgetUserActionMessage.GIVE_LIGHT_TO_PET:
                //this._container.connection.send(new _Str_7251(_local_2, PetSupplementEnum._Str_8421));
                break;
            case RoomWidgetUserActionMessage.TREAT_PET:
                //this._container.connection.send(new _Str_8184(_local_2));
                break;
            case RoomWidgetUserActionMessage.DROP_CARRY_ITEM:
                GetConnection().send(new RoomUnitDropHandItemComposer());
                break;
            case RoomWidgetUserActionMessage.REQUEST_PET_UPDATE:
                this.roomSession.userDataManager.requestPetInfo(userId);
                return;
            case RoomWidgetUserActionMessage.REPORT:
                return;
            case RoomWidgetUserActionMessage.REPORT_CFH_OTHER:
                return;
            case RoomWidgetUserActionMessage.AMBASSADOR_ALERT_USER:
                this.roomSession.sendAmbassadorAlertMessage(userId);
                return;
            case RoomWidgetUserActionMessage.AMBASSADOR_KICK_USER:
                this.roomSession.sendKickMessage(userId);
                return;
            case RoomWidgetUserActionMessage.AMBASSADOR_MUTE_USER_2MIN:
                this.roomSession.sendMuteMessage(userId, 2);
                return;
            case RoomWidgetUserActionMessage.AMBASSADOR_MUTE_USER_10MIN:
                this.roomSession.sendMuteMessage(userId, 10);
                return;
            case RoomWidgetUserActionMessage.AMBASSADOR_MUTE_USER_60MIN:
                this.roomSession.sendMuteMessage(userId, 60);
                return;
            case RoomWidgetUserActionMessage.AMBASSADOR_MUTE_USER_18HOUR:
                this.roomSession.sendMuteMessage(userId, 1080);
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
                    
                if(GetSessionDataManager().hasSecurity(SecurityLevel.MODERATOR)) GetConnection().send(new RoomAdsUpdateComposer(objectId, mapData));

                return;
            }
            case RoomWidgetChangeMottoMessage.CHANGE_MOTTO:
                this.roomSession.sendMottoMessage((message as RoomWidgetChangeMottoMessage).motto);
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
                const roomObject = GetRoomEngine().getRoomObject(this.roomSession.roomId, message.id, message.category);

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
                const userData = this.roomSession.userDataManager.getUserDataByIndex(message.id);

                if(!userData) break;

                id = userData.webID;
                name = userData.name;
                userType = userData.type;
                break;
            }
        }

        if(name) this.eventDispatcher.dispatchEvent(new RoomWidgetObjectNameEvent(message.id, message.category, id, name, userType));

        return null;
    }

    private processObjectInfoMessage(message: RoomWidgetRoomObjectMessage): RoomWidgetUpdateEvent
    {
        const roomId = this.roomSession.roomId;

        switch(message.category)
        {
            case RoomObjectCategory.FLOOR:
            case RoomObjectCategory.WALL:
                this.processFurniInfoMessage(message, roomId);
                break;
            case RoomObjectCategory.UNIT: {
                const userData = this.roomSession.userDataManager.getUserDataByIndex(message.id);

                if(!userData) break;

                switch(userData.type)
                {
                    case RoomObjectType.PET:
                        this.roomSession.userDataManager.requestPetInfo(userData.webID);
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

                // if(this._container.wiredService && (k.category === RoomObjectCategory.FLOOR))
                // {
                //     this._container.wiredService.selectFurniture(roomObject.id, furnitureData.name);
                // }
            }
        }

        if(objectType.indexOf('post_it') > -1) event.isStickie = true;

        const expiryTime = model.getValue<number>(RoomObjectVariable.FURNITURE_EXPIRY_TIME);
        const expiryTimestamp = model.getValue<number>(RoomObjectVariable.FURNITURE_EXPIRTY_TIMESTAMP);

        event.expiration = ((expiryTime < 0) ? expiryTime : Math.max(0, (expiryTime - ((Nitro.instance.time - expiryTimestamp) / 1000))));

        let roomObjectImage = GetRoomEngine().getRoomObjectImage(roomId, message.id, message.category, new Vector3d(180), 64, null);

        if(!roomObjectImage.data || (roomObjectImage.data.width > 140) || (roomObjectImage.data.height > 200))
        {
            roomObjectImage = GetRoomEngine().getRoomObjectImage(roomId, message.id, message.category, new Vector3d(180), 1, null);
        }

        event.image = roomObjectImage.getImage();
        event.isWallItem = (message.category === RoomObjectCategory.WALL);
        event.isRoomOwner = this.roomSession.isRoomOwner;
        event.roomControllerLevel = this.roomSession.controllerLevel;
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

        this.eventDispatcher.dispatchEvent(event);
    }

    private processUserInfoMessage(message: RoomWidgetRoomObjectMessage, roomId: number, userData: RoomUserData): void
    {
        let eventType = RoomWidgetUpdateInfostandUserEvent.OWN_USER;

        if(userData.webID !== GetSessionDataManager().userId) eventType = RoomWidgetUpdateInfostandUserEvent.PEER;

        const event = new RoomWidgetUpdateInfostandUserEvent(eventType);

        event.isSpectatorMode = this.roomSession.isSpectator;
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

        event.amIOwner = this.roomSession.isRoomOwner;
        event.isGuildRoom = this.roomSession.isGuildRoom;
        event.roomControllerLevel = this.roomSession.controllerLevel;
        event.amIAnyRoomController = GetSessionDataManager().isModerator;
        event.isAmbassador = GetSessionDataManager().isAmbassador;

        if(eventType === RoomWidgetUpdateInfostandUserEvent.PEER)
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

                if(flatControl !== null) event.targetRoomControllerLevel = flatControl;

                event.canBeMuted = this.canBeMuted(event);
                event.canBeKicked = this.canBeKicked(event);
                event.canBeBanned = this.canBeBanned(event);
            }

            event.isIgnored = GetSessionDataManager().isUserIgnored(userData.name);
            event.respectLeft = GetSessionDataManager().respectsLeft;

            const isShuttingDown = GetSessionDataManager().isSystemShutdown;
            const tradeMode = this.roomSession.tradeMode;

            if(isShuttingDown)
            {
                event.canTrade = false;
            }
            else
            {
                switch(tradeMode)
                {
                    case RoomTradingLevelEnum._Str_14475: {
                        const roomController = ((event.roomControllerLevel !== RoomControllerLevel.NONE) && (event.roomControllerLevel !== RoomControllerLevel.GUILD_MEMBER));
                        const targetController = ((event.targetRoomControllerLevel !== RoomControllerLevel.NONE) && (event.targetRoomControllerLevel !== RoomControllerLevel.GUILD_MEMBER));

                        event.canTrade = (roomController || targetController);
                        break;
                    }
                    case RoomTradingLevelEnum._Str_9173:
                        event.canTrade = true;
                        break;
                    default:
                        event.canTrade = false;
                        break;
                }
            }

            event.canTradeReason = RoomWidgetUpdateInfostandUserEvent.TRADE_REASON_OK;

            if(isShuttingDown) event.canTradeReason = RoomWidgetUpdateInfostandUserEvent.TRADE_REASON_SHUTDOWN;

            if(tradeMode !== RoomTradingLevelEnum._Str_9173) event.canTradeReason = RoomWidgetUpdateInfostandUserEvent.TRADE_REASON_NO_TRADING;

            // const _local_12 = GetSessionDataManager().userId;
            // _local_13 = GetSessionDataManager()._Str_18437(_local_12);
            // this._Str_16287(_local_12, _local_13);
        }

        event.groupId = parseInt(userData.guildId);
        //event._Str_5235 = GetSessionDataManager()._Str_17173(int(userData._Str_4592));
        event.groupName = userData.groupName;
        event.badges = this.roomSession.userDataManager.getUserBadges(userData.webID);
        event.figure = userData.figure;
        //var _local_8:Array = GetSessionDataManager()._Str_18437(userData.webID);
        //this._Str_16287(userData._Str_2394, _local_8);
        //this._container._Str_8097._Str_14387(userData.webID);
        //this._container.connection.send(new _Str_8049(userData._Str_2394));

        this.eventDispatcher.dispatchEvent(event);
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

        event.amIOwner = this.roomSession.isRoomOwner;
        event.isGuildRoom = this.roomSession.isGuildRoom;
        event.roomControllerLevel = this.roomSession.controllerLevel;
        event.amIAnyRoomController = GetSessionDataManager().isModerator;
        event.isAmbassador = GetSessionDataManager().isAmbassador;
        event.badges = [ RoomWidgetUpdateInfostandUserEvent.DEFAULT_BOT_BADGE_ID ];
        event.figure = userData.figure;

        this.eventDispatcher.dispatchEvent(event);
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

        event.amIOwner = this.roomSession.isRoomOwner;
        event.roomControllerLevel = this.roomSession.controllerLevel;
        event.amIAnyRoomController = GetSessionDataManager().isModerator;
        event.badges = [ RoomWidgetUpdateInfostandUserEvent.DEFAULT_BOT_BADGE_ID ];
        event.figure = userData.figure;

        this.eventDispatcher.dispatchEvent(event);
    }

    private processPetInfoEvent(event: RoomSessionPetInfoUpdateEvent): void
    {
        const petData = event._Str_24727;

        if(!petData) return;

        const roomPetData = this.roomSession.userDataManager.getPetData(petData.id);

        if(!roomPetData) return;

        const figure = roomPetData.figure;

        const petType = this.getPetType(figure);
        const petBreed = this.getPetBreed(figure);

        let posture: string = null;

        if(petType === PetType.MONSTERPLANT)
        {
            if(petData.level >= petData._Str_20651) posture = 'std';
            else posture = ('grw' + petData.level);
        }

        // var _local_8:String = (_local_4 + ((_local_7 != null) ? ("/posture=" + _local_7) : ""));
        // var _local_9:BitmapData = (this._cachedPetImages.getValue(_local_8) as BitmapData);
        // if (_local_9 == null)
        // {
        //     _local_9 = this._Str_2641(_local_4, _local_7);
        //     this._cachedPetImages.add(_local_8, _local_9);
        // }

        const isOwner = (petData.ownerId === GetSessionDataManager().userId);
        const infostandEvent = new RoomWidgetUpdateInfostandPetEvent(RoomWidgetUpdateInfostandPetEvent.PET_INFO);

        infostandEvent.name = roomPetData.name;
        infostandEvent.id = petData.id;
        infostandEvent.ownerId = petData.ownerId;
        infostandEvent.ownerName = petData.ownerName;
        infostandEvent.rarityLevel = petData.rarityLevel;
        infostandEvent.petType = petType;
        infostandEvent.petBreed = petBreed;
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
        infostandEvent.Str_4460 = petData._Str_3307;
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
            if(this.roomSession.isRoomOwner || GetSessionDataManager().isModerator || (this.roomSession.controllerLevel >= RoomControllerLevel.GUEST)) infostandEvent.canRemovePet = true;
        }

        this.eventDispatcher.dispatchEvent(infostandEvent);
    }

    private checkGuildSetting(event: RoomWidgetUpdateInfostandUserEvent): boolean
    {
        if(event.isGuildRoom) return (event.roomControllerLevel >= RoomControllerLevel.GUILD_ADMIN);

        return (event.roomControllerLevel >= RoomControllerLevel.GUEST);
    }

    private canBeMuted(event: RoomWidgetUpdateInfostandUserEvent): boolean
    {
        const checkSetting = (event: RoomWidgetUpdateInfostandUserEvent, moderation: RoomModerationParser) =>
        {
            switch(moderation.allowMute)
            {
                case RoomModerationParser._Str_5047:
                    return this.checkGuildSetting(event);
                default:
                    return (event.roomControllerLevel >= RoomControllerLevel.ROOM_OWNER);
            }
        }

        return this.isValidSetting(event, checkSetting);
    }

    private canBeKicked(event: RoomWidgetUpdateInfostandUserEvent): boolean
    {
        const checkSetting = (event: RoomWidgetUpdateInfostandUserEvent, moderation: RoomModerationParser) =>
        {
            switch(moderation.allowKick)
            {
                case RoomModerationParser._Str_11537:
                    return true;
                case RoomModerationParser._Str_5047:
                    return this.checkGuildSetting(event);
                default:
                    return (event.roomControllerLevel >= RoomControllerLevel.ROOM_OWNER);
            }
        }

        return this.isValidSetting(event, checkSetting);
    }

    private canBeBanned(event: RoomWidgetUpdateInfostandUserEvent): boolean
    {
        const checkSetting = (event: RoomWidgetUpdateInfostandUserEvent, moderation: RoomModerationParser) =>
        {
            switch(moderation.allowBan)
            {
                case RoomModerationParser._Str_5047:
                    return this.checkGuildSetting(event);
                default:
                    return (event.roomControllerLevel >= RoomControllerLevel.ROOM_OWNER);
            }
        }

        return this.isValidSetting(event, checkSetting);
    }

    private isValidSetting(event: RoomWidgetUpdateInfostandUserEvent, checkSetting: (event: RoomWidgetUpdateInfostandUserEvent, moderation: RoomModerationParser) => boolean): boolean
    {
        if(!this.roomSession._Str_7411) return false;

        const moderation = this.roomSession.moderationSettings;

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

    private getPetFigurePart(figure: string, index: number): number
    {
        if(!figure || !figure.length) return -1;

        const parts = figure.split(' ');

        if(parts.length > 0) return parseInt(parts[index]);

        return -1;
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
