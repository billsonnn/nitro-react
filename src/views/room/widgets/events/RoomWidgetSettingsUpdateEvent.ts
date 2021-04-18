import { RoomWidgetUpdateEvent } from 'nitro-renderer';

export class RoomWidgetSettingsUpdateEvent extends RoomWidgetUpdateEvent
{
    public static RWSUE_SETTINGS: string = 'RWSUE_SETTINGS';

    private _Str_9898: number;
    private _Str_2909: number;
    private _Str_2933: number;

    constructor(k: string, _arg_2: number, _arg_3: number, _arg_4: number)
    {
        super(k);

        this._Str_9898 = _arg_4;
        this._Str_2909 = _arg_3;
        this._Str_2933 = _arg_2;
    }

    public get _Str_16610(): number
    {
        return this._Str_9898;
    }

    public get _Str_3488(): number
    {
        return this._Str_2909;
    }

    public get _Str_3410(): number
    {
        return this._Str_2933;
    }
}
