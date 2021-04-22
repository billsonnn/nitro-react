import { RoomWidgetUpdateEvent } from 'nitro-renderer';

export class RoomWidgetRentableBotInfostandUpdateEvent extends RoomWidgetUpdateEvent
{
    public static RENTABLE_BOT: string = 'RWRBIUE_RENTABLE_BOT';
    public static _Str_7492: string = 'RENTABLE_BOT';

    private _name: string = '';
    private _motto: string = '';
    private _Str_4900: number = 0;
    private _figure: string = '';
    private _badges: string[];
    private _caryId: number = 0;
    private _Str_5131: number = 0;
    private _ownerId: number;
    private _ownerName: string;
    private _Str_4026: boolean = false;
    private _Str_4028: boolean = false;
    private _roomControllerLevel: number = 0;
    private _Str_3986: number[];

    constructor()
    {
        super(RoomWidgetRentableBotInfostandUpdateEvent.RENTABLE_BOT);

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

    public set id(k: number)
    {
        this._Str_4900 = k;
    }

    public get id(): number
    {
        return this._Str_4900;
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

    public get ownerId(): number
    {
        return this._ownerId;
    }

    public set ownerId(k: number)
    {
        this._ownerId = k;
    }

    public get ownerName(): string
    {
        return this._ownerName;
    }

    public set ownerName(k: string)
    {
        this._ownerName = k;
    }

    public set _Str_3246(k: boolean)
    {
        this._Str_4026 = k;
    }

    public get _Str_3246(): boolean
    {
        return this._Str_4026;
    }

    public set roomControllerLevel(k: number)
    {
        this._roomControllerLevel = k;
    }

    public get roomControllerLevel(): number
    {
        return this._roomControllerLevel;
    }

    public set _Str_3529(k: boolean)
    {
        this._Str_4028 = k;
    }

    public get _Str_3529(): boolean
    {
        return this._Str_4028;
    }

    public set carryId(k: number)
    {
        this._caryId = k;
    }

    public get carryId(): number
    {
        return this._caryId;
    }

    public set roomIndex(k: number)
    {
        this._Str_5131 = k;
    }

    public get roomIndex(): number
    {
        return this._Str_5131;
    }

    public get botSkills(): number[]
    {
        return this._Str_3986;
    }

    public set botSkills(k: number[])
    {
        this._Str_3986 = k;
    }
}
