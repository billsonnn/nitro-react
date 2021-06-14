import { RoomUnitDropHandItemComposer, RoomUnitGiveHandItemComposer, RoomUserData } from 'nitro-renderer';
import { GetConnection } from '../GetConnection';
import { GetRoomSession } from './GetRoomSession';
import { GetSessionDataManager } from './GetSessionDataManager';

export class UserAction
{
    public static WHISPER_USER: string = 'UA_WHISPER_USER';
    public static IGNORE_USER: string = 'UA_IGNORE_USER';
    public static IGNORE_USER_BUBBLE: string = 'UA_IGNORE_USER_BUBBLE';
    public static UNIGNORE_USER: string = 'UA_UNIGNORE_USER';
    public static KICK_USER: string = 'UA_KICK_USER';
    public static BAN_USER_HOUR: string = 'UA_BAN_USER_HOUR';
    public static BAN_USER_DAY: string = 'UA_BAN_USER_DAY';
    public static BAN_USER_PERM: string = 'UA_BAN_USER_PERM';
    public static MUTE_USER_2MIN: string = 'UA_MUTE_USER_2MIN';
    public static MUTE_USER_5MIN: string = 'UA_MUTE_USER_5MIN';
    public static MUTE_USER_10MIN: string = 'UA_MUTE_USER_10MIN';
    public static SEND_FRIEND_REQUEST: string = 'UA_SEND_FRIEND_REQUEST';
    public static RESPECT_USER: string = 'UA_RESPECT_USER';
    public static GIVE_RIGHTS: string = 'UA_GIVE_RIGHTS';
    public static TAKE_RIGHTS: string = 'UA_TAKE_RIGHTS';
    public static START_TRADING: string = 'UA_START_TRADING';
    public static OPEN_HOME_PAGE: string = 'UA_OPEN_HOME_PAGE';
    public static REPORT: string = 'UA_REPORT';
    public static PICKUP_PET: string = 'UA_PICKUP_PET';
    public static MOUNT_PET: string = 'UA_MOUNT_PET';
    public static TOGGLE_PET_RIDING_PERMISSION: string = 'UA_TOGGLE_PET_RIDING_PERMISSION';
    public static TOGGLE_PET_BREEDING_PERMISSION: string = 'UA_TOGGLE_PET_BREEDING_PERMISSION';
    public static DISMOUNT_PET: string = 'UA_DISMOUNT_PET';
    public static SADDLE_OFF: string = 'UA_SADDLE_OFF';
    public static TRAIN_PET: string = 'UA_TRAIN_PET';
    public static RESPECT_PET: string = 'UA_ RESPECT_PET';
    public static TREAT_PET: string = 'UA_TREAT_PET';
    public static REQUEST_PET_UPDATE: string = 'UA_REQUEST_PET_UPDATE';
    public static START_NAME_CHANGE: string = 'UA_START_NAME_CHANGE';
    public static PASS_CARRY_ITEM: string = 'UA_PASS_CARRY_ITEM';
    public static DROP_CARRY_ITEM: string = 'UA_DROP_CARRY_ITEM';
    public static GIVE_CARRY_ITEM_TO_PET: string = 'UA_GIVE_CARRY_ITEM_TO_PET';
    public static GIVE_WATER_TO_PET: string = 'UA_GIVE_WATER_TO_PET';
    public static GIVE_LIGHT_TO_PET: string = 'UA_GIVE_LIGHT_TO_PET';
    public static REQUEST_BREED_PET: string = 'UA_REQUEST_BREED_PET';
    public static HARVEST_PET: string = 'UA_HARVEST_PET';
    public static REVIVE_PET: string = 'UA_REVIVE_PET';
    public static COMPOST_PLANT: string = 'UA_COMPOST_PLANT';
    public static GET_BOT_INFO: string = 'UA_GET_BOT_INFO';
    public static REPORT_CFH_OTHER: string = 'UA_REPORT_CFH_OTHER';
    public static AMBASSADOR_ALERT_USER: string = 'UA_AMBASSADOR_ALERT_USER';
    public static AMBASSADOR_KICK_USER: string = 'UA_AMBASSADOR_KICK_USER';
    public static AMBASSADOR_MUTE_USER_2MIN: string = 'UA_AMBASSADOR_MUTE_2MIN';
    public static AMBASSADOR_MUTE_USER_10MIN: string = 'UA_AMBASSADOR_MUTE_10MIN';
    public static AMBASSADOR_MUTE_USER_60MIN: string = 'UA_AMBASSADOR_MUTE_60MIN';
    public static AMBASSADOR_MUTE_USER_18HOUR: string = 'UA_AMBASSADOR_MUTE_18HOUR';
}

export function ProcessUserAction(userId: number, type: string): void
{
    let userData: RoomUserData = null;

    const petMessages = [
        UserAction.REQUEST_PET_UPDATE,
        UserAction.RESPECT_PET,
        UserAction.PICKUP_PET,
        UserAction.MOUNT_PET,
        UserAction.TOGGLE_PET_RIDING_PERMISSION,
        UserAction.TOGGLE_PET_BREEDING_PERMISSION,
        UserAction.DISMOUNT_PET,
        UserAction.SADDLE_OFF,
        UserAction.GIVE_CARRY_ITEM_TO_PET,
        UserAction.GIVE_WATER_TO_PET,
        UserAction.GIVE_LIGHT_TO_PET,
        UserAction.TREAT_PET
    ];

    if(petMessages.indexOf(type) >= 0)
    {
        userData = GetRoomSession().userDataManager.getPetData(userId);
    }
    else
    {
        userData = GetRoomSession().userDataManager.getUserData(userId);
    }

    if(!userData) return

    switch(type)
    {
        case UserAction.RESPECT_USER:
            GetSessionDataManager().giveRespect(userId);
            return;
        case UserAction.RESPECT_PET:
            GetSessionDataManager().givePetRespect(userId);
            return;
        // case UserAction.WHISPER_USER:
        //     this._container.events.dispatchEvent(new RoomWidgetChatInputContentUpdateEvent(RoomWidgetChatInputContentUpdateEvent.WHISPER, userData.name));
        //     return;
        case UserAction.IGNORE_USER:
            GetSessionDataManager().ignoreUser(userData.name);
            return;
        case UserAction.UNIGNORE_USER:
            GetSessionDataManager().unignoreUser(userData.name);
            return;
        case UserAction.KICK_USER:
            GetRoomSession().sendKickMessage(userId);
            return;
        case UserAction.BAN_USER_DAY:
        case UserAction.BAN_USER_HOUR:
        case UserAction.BAN_USER_PERM:
            GetRoomSession().sendBanMessage(userId, type);
            return;
        case UserAction.MUTE_USER_2MIN:
            GetRoomSession().sendMuteMessage(userId, 2);
            return;
        case UserAction.MUTE_USER_5MIN:
            GetRoomSession().sendMuteMessage(userId, 5);
            return;
        case UserAction.MUTE_USER_10MIN:
            GetRoomSession().sendMuteMessage(userId, 10);
            return;
        case UserAction.GIVE_RIGHTS:
            GetRoomSession().sendGiveRightsMessage(userId);
            return;
        case UserAction.TAKE_RIGHTS:
            GetRoomSession().sendTakeRightsMessage(userId);
            return;
        // case UserAction.START_TRADING:
        //     if(userData) this._widget.inventoryTrading.startTrade(userData.roomIndex, userData.name);
        //     return;
        // case UserAction.OPEN_HOME_PAGE:
        //     GetSessionDataManager()._Str_21275(userId, _local_3.name);
        //     return;
        // case UserAction.PICKUP_PET:
        //     GetRoomSession()._Str_13781(_local_2);
        //     return;
        // case UserAction.MOUNT_PET:
        //     GetRoomSession()._Str_21066(_local_2);
        //     return;
        // case UserAction.TOGGLE_PET_RIDING_PERMISSION:
        //     GetRoomSession()._Str_21025(_local_2);
        //     return;
        // case UserAction.TOGGLE_PET_BREEDING_PERMISSION:
        //     GetRoomSession()._Str_21562(_local_2);
        //     return;
        // case UserAction.DISMOUNT_PET:
        //     GetRoomSession()._Str_19075(_local_2);
        //     return;
        // case UserAction.SADDLE_OFF:
        //     GetRoomSession()._Str_21635(_local_2);
        //     return;
        case UserAction.PASS_CARRY_ITEM:
            GetConnection().send(new RoomUnitGiveHandItemComposer(userId));
            return;
        // case UserAction.GIVE_CARRY_ITEM_TO_PET:
        //     GetConnection().send(new RoomUnitGiveHandItemPetComposer(userId));
        //     return;
        // case UserAction.GIVE_WATER_TO_PET:
        //     GetConnection().send(new _Str_7251(_local_2, PetSupplementEnum._Str_9473));
        //     return;
        // case UserAction.GIVE_LIGHT_TO_PET:
        //     GetConnection().send(new _Str_7251(_local_2, PetSupplementEnum._Str_8421));
        //     return;
        // case UserAction.TREAT_PET:
        //     GetConnection().send(new _Str_8184(_local_2));
        //     return;
        case UserAction.DROP_CARRY_ITEM:
            GetConnection().send(new RoomUnitDropHandItemComposer());
            return;
        case UserAction.REQUEST_PET_UPDATE:
            GetRoomSession().userDataManager.requestPetInfo(userId);
            return;
        case UserAction.REPORT:
            return;
        case UserAction.REPORT_CFH_OTHER:
            return;
        case UserAction.AMBASSADOR_ALERT_USER:
            GetRoomSession().sendAmbassadorAlertMessage(userId);
            return;
        case UserAction.AMBASSADOR_KICK_USER:
            GetRoomSession().sendKickMessage(userId);
            return;
        case UserAction.AMBASSADOR_MUTE_USER_2MIN:
            GetRoomSession().sendMuteMessage(userId, 2);
            return;
        case UserAction.AMBASSADOR_MUTE_USER_10MIN:
            GetRoomSession().sendMuteMessage(userId, 10);
            return;
        case UserAction.AMBASSADOR_MUTE_USER_60MIN:
            GetRoomSession().sendMuteMessage(userId, 60);
            return;
        case UserAction.AMBASSADOR_MUTE_USER_18HOUR:
            GetRoomSession().sendMuteMessage(userId, 1080);
            return;
    }
}
