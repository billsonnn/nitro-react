import { RoomWidgetUpdateEvent } from 'nitro-renderer';

export class RoomWidgetClothingChangeUpdateEvent extends RoomWidgetUpdateEvent
{
    public static RWCCUE_SHOW_GENDER_SELECTION: string = 'RWCCUE_SHOW_GENDER_SELECTION';
    public static RWCCUE_SHOW_CLOTHING_EDITOR: string = 'RWCCUE_SHOW_CLOTHING_EDITOR';

    private _Str_2319: number = -1;
    private _Str_3014: number = -1;
    private _roomId: number = -1;

    constructor(k: string, _arg_2: number = 0, _arg_3: number = 0, _arg_4: number = 0)
    {
        super(k);

        this._Str_2319 = _arg_2;
        this._Str_3014 = _arg_3;
        this._roomId = _arg_4;
    }

    public get _Str_1577(): number
    {
        return this._Str_2319;
    }

    public get _Str_4093(): number
    {
        return this._Str_3014;
    }

    public get roomId(): number
    {
        return this._roomId;
    }
}
