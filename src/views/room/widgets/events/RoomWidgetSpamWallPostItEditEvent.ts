import { RoomWidgetUpdateEvent } from 'nitro-renderer';

export class RoomWidgetSpamWallPostItEditEvent extends RoomWidgetUpdateEvent
{
    public static RWSWPUE_OPEN_EDITOR: string = 'RWSWPUE_OPEN_EDITOR';

    private _Str_2319: number;
    private _location: string;
    private _Str_3796: string;

    constructor(k: string, _arg_2: number, _arg_3: string, _arg_4: string)
    {
        super(k);

        this._Str_2319 = _arg_2;
        this._location = _arg_3;
        this._Str_3796 = _arg_4;
    }

    public get location(): string
    {
        return this._location;
    }

    public get _Str_1577(): number
    {
        return this._Str_2319;
    }

    public get _Str_1723(): string
    {
        return this._Str_3796;
    }
}
