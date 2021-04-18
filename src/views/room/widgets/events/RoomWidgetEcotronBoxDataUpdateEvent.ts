import { RoomWidgetUpdateEvent } from 'nitro-renderer';

export class RoomWidgetEcotronBoxDataUpdateEvent extends RoomWidgetUpdateEvent
{
    public static RWEBDUE_PACKAGEINFO: string = 'RWEBDUE_PACKAGEINFO';
    public static RWEBDUE_CONTENTS: string = 'RWEBDUE_CONTENTS';

    private _Str_2319: number = -1;
    private _text: string;
    private _Str_6880: string;
    private _controller: boolean;
    private _Str_12168: string;

    constructor(k: string, _arg_2: number, _arg_3: string, _arg_4: string, _arg_5: boolean = false, _arg_6: string = null)
    {
        super(k);

        this._Str_2319 = _arg_2;
        this._text = _arg_3;
        this._Str_6880 = _arg_4;
        this._controller = _arg_5;
        this._Str_12168 = _arg_6;
    }

    public get _Str_1577(): number
    {
        return this._Str_2319;
    }

    public get text(): string
    {
        return this._text;
    }

    public get controller(): boolean
    {
        return this._controller;
    }

    public get _Str_11625(): string
    {
        return this._Str_12168;
    }

    public get _Str_17878(): string
    {
        return this._Str_6880;
    }
}
