import { RoomWidgetUpdateEvent } from './RoomWidgetUpdateEvent';

export class RoomWidgetUpdateTrophyEvent extends RoomWidgetUpdateEvent
{
    public static TROPHY_UPDATE: string = 'RWUTE_TROPHY_UPDATE';

    private _color: number;
    private _name: string;
    private _date: string;
    private _message: string;
    private _extra: number;

    constructor(type: string, color: number, name: string, date: string, message: string, extra: number)
    {
        super(type);

        this._color = color;
        this._name = name;
        this._date = date;
        this._message = message;
        this._extra = extra;
    }

    public get color(): number
    {
        return this._color;
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

    public get extra(): number
    {
        return this._extra;
    }
}
