import { RoomWidgetUpdateEvent } from 'nitro-renderer';

export class RoomWidgetStickieDataUpdateEvent extends RoomWidgetUpdateEvent
{
    public static RWSDUE_STICKIE_DATA: string = 'RWSDUE_STICKIE_DATA';

    private _Str_2319: number = -1;
    private _Str_3796: string;
    private _text: string;
    private _Str_3062: string;
    private _controller: boolean;

    constructor(k: string, _arg_2: number, _arg_3: string, _arg_4: string, _arg_5: string, _arg_6: boolean)
    {
        super(k);

        this._Str_2319 = _arg_2;
        this._Str_3796 = _arg_3;
        this._text = _arg_4;
        this._Str_3062 = _arg_5;
        this._controller = _arg_6;
    }

    public get _Str_1577(): number
    {
        return this._Str_2319;
    }

    public get _Str_1723(): string
    {
        return this._Str_3796;
    }

    public get text(): string
    {
        return this._text;
    }

    public get _Str_10471(): string
    {
        return this._Str_3062;
    }

    public get controller(): boolean
    {
        return this._controller;
    }
}
