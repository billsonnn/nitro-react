import { RoomWidgetMessage } from './RoomWidgetMessage';

export class RoomWidgetUserActionMessage extends RoomWidgetMessage
{
    public static WHISPER_USER: string = 'RWUAM_WHISPER_USER';
    public static IGNORE_USER: string = 'RWUAM_IGNORE_USER';
    public static IGNORE_USER_BUBBLE: string = 'RWUAM_IGNORE_USER_BUBBLE';
    public static UNIGNORE_USER: string = 'RWUAM_UNIGNORE_USER';
    public static KICK_USER: string = 'RWUAM_KICK_USER';
    public static BAN_USER_HOUR: string = 'RWUAM_BAN_USER_HOUR';
    public static BAN_USER_DAY: string = 'RWUAM_BAN_USER_DAY';
    public static BAN_USER_PERM: string = 'RWUAM_BAN_USER_PERM';
    public static MUTE_USER_2MIN: string = 'RWUAM_MUTE_USER_2MIN';
    public static MUTE_USER_5MIN: string = 'RWUAM_MUTE_USER_5MIN';
    public static MUTE_USER_10MIN: string = 'RWUAM_MUTE_USER_10MIN';
    public static SEND_FRIEND_REQUEST: string = 'RWUAM_SEND_FRIEND_REQUEST';
    public static RESPECT_USER: string = 'RWUAM_RESPECT_USER';
    public static GIVE_RIGHTS: string = 'RWUAM_GIVE_RIGHTS';
    public static TAKE_RIGHTS: string = 'RWUAM_TAKE_RIGHTS';
    public static START_TRADING: string = 'RWUAM_START_TRADING';
    public static OPEN_HOME_PAGE: string = 'RWUAM_OPEN_HOME_PAGE';
    public static REPORT: string = 'RWUAM_REPORT';
    public static PICKUP_PET: string = 'RWUAM_PICKUP_PET';
    public static MOUNT_PET: string = 'RWUAM_MOUNT_PET';
    public static TOGGLE_PET_RIDING_PERMISSION: string = 'RWUAM_TOGGLE_PET_RIDING_PERMISSION';
    public static TOGGLE_PET_BREEDING_PERMISSION: string = 'RWUAM_TOGGLE_PET_BREEDING_PERMISSION';
    public static DISMOUNT_PET: string = 'RWUAM_DISMOUNT_PET';
    public static SADDLE_OFF: string = 'RWUAM_SADDLE_OFF';
    public static TRAIN_PET: string = 'RWUAM_TRAIN_PET';
    public static RESPECT_PET: string = ' RWUAM_RESPECT_PET';
    public static TREAT_PET: string = 'RWUAM_TREAT_PET';
    public static REQUEST_PET_UPDATE: string = 'RWUAM_REQUEST_PET_UPDATE';
    public static START_NAME_CHANGE: string = 'RWUAM_START_NAME_CHANGE';
    public static PASS_CARRY_ITEM: string = 'RWUAM_PASS_CARRY_ITEM';
    public static DROP_CARRY_ITEM: string = 'RWUAM_DROP_CARRY_ITEM';
    public static GIVE_CARRY_ITEM_TO_PET: string = 'RWUAM_GIVE_CARRY_ITEM_TO_PET';
    public static GIVE_WATER_TO_PET: string = 'RWUAM_GIVE_WATER_TO_PET';
    public static GIVE_LIGHT_TO_PET: string = 'RWUAM_GIVE_LIGHT_TO_PET';
    public static REQUEST_BREED_PET: string = 'RWUAM_REQUEST_BREED_PET';
    public static HARVEST_PET: string = 'RWUAM_HARVEST_PET';
    public static REVIVE_PET: string = 'RWUAM_REVIVE_PET';
    public static COMPOST_PLANT: string = 'RWUAM_COMPOST_PLANT';
    public static GET_BOT_INFO: string = 'RWUAM_GET_BOT_INFO';
    public static REPORT_CFH_OTHER: string = 'RWUAM_REPORT_CFH_OTHER';
    public static AMBASSADOR_ALERT_USER: string = 'RWUAM_AMBASSADOR_ALERT_USER';
    public static AMBASSADOR_KICK_USER: string = 'RWUAM_AMBASSADOR_KICK_USER';
    public static AMBASSADOR_MUTE_USER_2MIN: string = 'RWUAM_AMBASSADOR_MUTE_2MIN';
    public static AMBASSADOR_MUTE_USER_10MIN: string = 'RWUAM_AMBASSADOR_MUTE_10MIN';
    public static AMBASSADOR_MUTE_USER_60MIN: string = 'RWUAM_AMBASSADOR_MUTE_60MIN';
    public static AMBASSADOR_MUTE_USER_18HOUR: string = 'RWUAM_AMBASSADOR_MUTE_18HOUR';

    private _userId: number;

    constructor(type: string, userId: number)
    {
        super(type);

        this._userId = userId;
    }

    public get userId(): number
    {
        return this._userId;
    }
}
