import { RoomWidgetUpdateEvent } from 'nitro-renderer';

export class RoomWidgetPetStatusUpdateEvent extends RoomWidgetUpdateEvent
{
    public static RWPIUE_PET_STATUS_UPDATE: string = 'RWPIUE_PET_STATUS_UPDATE';

    private _Str_2388: number;
    private _Str_3101: boolean;
    private _Str_3297: boolean;
    private _Str_3284: boolean;
    private _Str_3095: boolean;

    constructor(k: number, _arg_2: boolean, _arg_3: boolean, _arg_4: boolean, _arg_5: boolean)
    {
        super(RoomWidgetPetStatusUpdateEvent.RWPIUE_PET_STATUS_UPDATE);

        this._Str_2388 = k;
        this._Str_3101 = _arg_2;
        this._Str_3297 = _arg_3;
        this._Str_3284 = _arg_4;
        this._Str_3095 = _arg_5;
    }

    public get _Str_2508(): number
    {
        return this._Str_2388;
    }

    public get _Str_2934(): boolean
    {
        return this._Str_3101;
    }

    public get _Str_3068(): boolean
    {
        return this._Str_3297;
    }

    public get _Str_2898(): boolean
    {
        return this._Str_3284;
    }

    public get _Str_2921(): boolean
    {
        return this._Str_3095;
    }
}
