import { RoomWidgetUpdateEvent } from 'nitro-renderer';

export class RoomWidgetTrophyUpdateEvent extends RoomWidgetUpdateEvent
{
    public static TROPHY_DATA: string = 'RWTDUE_TROPHY_DATA';

    private _name: string;
    private _date: string;
    private _message: string;
    private _color: number;
    private _viewType: number;

    constructor(type: string, name: string, date: string, message: string, color: number, viewType: number)
    {
        super(type);

        this._name      = name;
        this._date      = date;
        this._message   = message;
        this._color     = color;
        this._viewType  = viewType;
    }

    public get name(): string
    {
        return this._name;
    }

    public get date(): string
    {
        return this._date;
    }

    public get message(): string
    {
        return this._message;
    }

    public get color(): number
    {
        return this._color;
    }

    public get viewType(): number
    {
        return this._viewType;
    }
}
