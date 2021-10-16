import { RoomWidgetUpdateEvent } from './RoomWidgetUpdateEvent';

export class RoomWidgetUpdateMannequinEvent extends RoomWidgetUpdateEvent
{
    public static MANNEQUIN_UPDATE: string = 'RWUME_MANNEQUIN_UPDATE';

    private _objectId: number;
    private _figure: string;
    private _gender: string;
    private _name: string;

    constructor(type: string, objectId: number, figure: string, gender: string, name: string)
    {
        super(type);

        this._objectId = objectId;
        this._figure = figure;
        this._gender = gender;
        this._name = name;
    }

    public get objectId(): number
    {
        return this._objectId;
    }

    public get figure(): string
    {
        return this._figure;
    }

    public get gender(): string
    {
        return this._gender;
    }

    public get name(): string
    {
        return this._name;
    }
}
