import { RoomWidgetUpdateInfostandEvent } from './RoomWidgetUpdateInfostandEvent';

export class RoomWidgetUpdateInfostandUserEvent extends RoomWidgetUpdateInfostandEvent
{
    public static OWN_USER: string = 'RWUIUE_OWN_USER';
    public static PEER: string = 'RWUIUE_PEER';
    public static BOT: string = 'RWUIUE_BOT';
    public static TRADE_REASON_OK: number = 0;
    public static TRADE_REASON_SHUTDOWN: number = 2;
    public static TRADE_REASON_NO_TRADING: number = 3;
    public static DEFAULT_BOT_BADGE_ID: string = 'BOT';

    public name: string = '';
    public motto: string = '';
    public achievementScore: number = 0;
    public webID: number = 0;
    public xp: number = 0;
    public userType: number = -1;
    public figure: string = '';
    public badges: string[] = [];
    public groupId: number = 0;
    public groupName: string = '';
    public groupBadgeId: string = '';
    public carryItem: number = 0;
    public roomIndex: number = 0;
    public isSpectatorMode: boolean = false;
    public realName: string = '';
    public allowNameChange: boolean = false;
    public amIOwner: boolean = false;
    public amIAnyRoomController: boolean = false;
    public roomControllerLevel: number = 0;
    public canBeAskedAsFriend: boolean = false;
    public canBeKicked: boolean = false;
    public canBeBanned: boolean = false;
    public canBeMuted: boolean = false;
    public respectLeft: number = 0;
    public isIgnored: boolean = false;
    public isGuildRoom: boolean = false;
    public canTrade: boolean = false;
    public canTradeReason: number = 0;
    public targetRoomControllerLevel: number = 0;
    public isFriend: boolean = false;
    public isAmbassador: boolean = false;

    public get isOwnUser(): boolean
    {
        return (this.type === RoomWidgetUpdateInfostandUserEvent.OWN_USER);
    }
}
