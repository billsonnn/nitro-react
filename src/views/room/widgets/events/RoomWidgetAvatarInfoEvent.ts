import { RoomWidgetUpdateEvent } from 'nitro-renderer';

export class RoomWidgetAvatarInfoEvent extends RoomWidgetUpdateEvent
{
    public static RWAIE_AVATAR_INFO: string = 'RWAIE_AVATAR_INFO';

    private _userId: number;
    private _userName: string;
    private _Str_3021: number;
    private _Str_3947: boolean;
    private _Str_2775: number;

    constructor(k: number, _arg_2: string, _arg_3: number, _arg_4: number, _arg_5: boolean)
    {
        super(RoomWidgetAvatarInfoEvent.RWAIE_AVATAR_INFO);

        this._userId = k;
        this._userName = _arg_2;
        this._Str_3021 = _arg_3;
        this._Str_2775 = _arg_4;
        this._Str_3947 = _arg_5;
    }

    public get userId(): number
    {
        return this._userId;
    }

    public get userName(): string
    {
        return this._userName;
    }

    public get _Str_2908(): number
    {
        return this._Str_3021;
    }

    public get _Str_2707(): number
    {
        return this._Str_2775;
    }

    public get _Str_4330(): boolean
    {
        return this._Str_3947;
    }
}
