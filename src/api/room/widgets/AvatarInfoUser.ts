import { IAvatarInfo } from './IAvatarInfo';

export class AvatarInfoUser implements IAvatarInfo
{
    public static OWN_USER: string = 'IUI_OWN_USER';
    public static PEER: string = 'IUI_PEER';
    public static BOT: string = 'IUI_BOT';
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
    public allowNameChange: boolean = false;
    public amIOwner: boolean = false;
    public amIAnyRoomController: boolean = false;
    public roomControllerLevel: number = 0;
    public canBeKicked: boolean = false;
    public canBeBanned: boolean = false;
    public canBeMuted: boolean = false;
    public respectLeft: number = 0;
    public isIgnored: boolean = false;
    public isGuildRoom: boolean = false;
    public canTrade: boolean = false;
    public canTradeReason: number = 0;
    public targetRoomControllerLevel: number = 0;
    public isAmbassador: boolean = false;

    constructor(public readonly type: string) 
    {}

    public get isOwnUser(): boolean
    {
        return (this.type === AvatarInfoUser.OWN_USER);
    }
}
