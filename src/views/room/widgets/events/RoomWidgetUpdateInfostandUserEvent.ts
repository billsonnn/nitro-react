import { RoomWidgetUpdateEvent } from 'nitro-renderer';

export class RoomWidgetUpdateInfostandUserEvent extends RoomWidgetUpdateEvent
{
    public static OWN_USER: string = 'RWUIUE_OWN_USER';
    public static BOT: string = 'RWUIUE_BOT';
    public static PEER: string = 'RWUIUE_PEER';
    public static _Str_18400: number = 0;
    public static _Str_14161: number = 2;
    public static _Str_13798: number = 3;
    public static _Str_7492: string = 'BOT';

    private _name: string = '';
    private _motto: string = '';
    private _activityPoints: number;
    private _Str_4900: number = 0;
    private _xp: number = 0;
    private _Str_3021: number;
    private _figure: string = '';
    private _badges: string[];
    private _groupId: number = 0;
    private _groupName: string = '';
    private _Str_11289: string = '';
    private _Str_5228: number = 0;
    private _Str_5131: number = 0;
    private _Str_8522: boolean = false;
    private _realName: string = '';
    private _Str_3947: boolean = false;
    private _Str_4026: boolean = false;
    private _Str_4028: boolean = false;
    private _roomControllerLevel: number = 0;
    private _canBeAskedForAFriend: boolean = false;
    private _Str_9070: boolean = false;
    private _Str_8457: boolean = false;
    private _Str_8831: boolean = false;
    private _Str_3437: number = 0;
    private _Str_6028: boolean = false;
    private _Str_6139: boolean = false;
    private _Str_8973: boolean = false;
    private _Str_8910: number = 0;
    private _Str_8858: number = 0;
    private _isFriend: boolean = false;
    private _Str_4890: boolean = false;

    constructor(k: string)
    {
        super(k);

        this._badges = [];
    }

    public set name(k: string)
    {
        this._name = k;
    }

    public get name(): string
    {
        return this._name;
    }

    public set motto(k: string)
    {
        this._motto = k;
    }

    public get motto(): string
    {
        return this._motto;
    }

    public set activityPoints(k: number)
    {
        this._activityPoints = k;
    }

    public get activityPoints(): number
    {
        return this._activityPoints;
    }

    public set webID(k: number)
    {
        this._Str_4900 = k;
    }

    public get webID(): number
    {
        return this._Str_4900;
    }

    public set xp(k: number)
    {
        this._xp = k;
    }

    public get xp(): number
    {
        return this._xp;
    }

    public set userType(k: number)
    {
        this._Str_3021 = k;
    }

    public get userType(): number
    {
        return this._Str_3021;
    }

    public set figure(k: string)
    {
        this._figure = k;
    }

    public get figure(): string
    {
        return this._figure;
    }

    public set badges(k: string[])
    {
        this._badges = k;
    }

    public get badges(): string[]
    {
        return this._badges;
    }

    public set groupId(k: number)
    {
        this._groupId = k;
    }

    public get groupId(): number
    {
        return this._groupId;
    }

    public set groupName(k: string)
    {
        this._groupName = k;
    }

    public get groupName(): string
    {
        return this._groupName;
    }

    public set groupBadgeId(k: string)
    {
        this._Str_11289 = k;
    }

    public get groupBadgeId(): string
    {
        return this._Str_11289;
    }

    public set canBeAskedForAFriend(k: boolean)
    {
        this._canBeAskedForAFriend = k;
    }

    public get canBeAskedForAFriend(): boolean
    {
        return this._canBeAskedForAFriend;
    }

    public set respectLeft(k: number)
    {
        this._Str_3437 = k;
    }

    public get respectLeft(): number
    {
        return this._Str_3437;
    }

    public set isIgnored(k: boolean)
    {
        this._Str_6028 = k;
    }

    public get isIgnored(): boolean
    {
        return this._Str_6028;
    }

    public set isRoomOwner(k: boolean)
    {
        this._Str_4026 = k;
    }

    public get isRoomOwner(): boolean
    {
        return this._Str_4026;
    }

    public set isGuildRoom(k: boolean)
    {
        this._Str_6139 = k;
    }

    public get isGuildRoom(): boolean
    {
        return this._Str_6139;
    }

    public set roomControllerLevel(k: number)
    {
        this._roomControllerLevel = k;
    }

    public get roomControllerLevel(): number
    {
        return this._roomControllerLevel;
    }

    public set isModerator(k: boolean)
    {
        this._Str_4028 = k;
    }

    public get isModerator(): boolean
    {
        return this._Str_4028;
    }

    public set canTrade(k: boolean)
    {
        this._Str_8973 = k;
    }

    public get canTrade(): boolean
    {
        return this._Str_8973;
    }

    public set _Str_6622(k: number)
    {
        this._Str_8910 = k;
    }

    public get _Str_6622(): number
    {
        return this._Str_8910;
    }

    public set _Str_5990(k: boolean)
    {
        this._Str_9070 = k;
    }

    public get _Str_5990(): boolean
    {
        return this._Str_9070;
    }

    public set _Str_6701(k: boolean)
    {
        this._Str_8457 = k;
    }

    public get _Str_6701(): boolean
    {
        return this._Str_8457;
    }

    public get _Str_6394(): boolean
    {
        return this._Str_8831;
    }

    public set _Str_6394(k: boolean)
    {
        this._Str_8831 = k;
    }

    public set flatControl(k: number)
    {
        this._Str_8858 = k;
    }

    public get flatControl(): number
    {
        return this._Str_8858;
    }

    public set carryId(k: number)
    {
        this._Str_5228 = k;
    }

    public get carryId(): number
    {
        return this._Str_5228;
    }

    public set roomIndex(k: number)
    {
        this._Str_5131 = k;
    }

    public get roomIndex(): number
    {
        return this._Str_5131;
    }

    public set isSpectator(k: boolean)
    {
        this._Str_8522 = k;
    }

    public get isSpectator(): boolean
    {
        return this._Str_8522;
    }

    public set realName(k: string)
    {
        this._realName = k;
    }

    public get realName(): string
    {
        return this._realName;
    }

    public set _Str_4330(k: boolean)
    {
        this._Str_3947 = k;
    }

    public get _Str_4330(): boolean
    {
        return this._Str_3947;
    }

    public get isFriend(): boolean
    {
        return this._isFriend;
    }

    public set isFriend(k: boolean)
    {
        this._isFriend = k;
    }

    public get isAmbassador(): boolean
    {
        return this._Str_4890;
    }

    public set isAmbassador(k: boolean)
    {
        this._Str_4890 = k;
    }
}
