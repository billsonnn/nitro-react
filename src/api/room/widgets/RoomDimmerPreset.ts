export class RoomDimmerPreset
{
    private _id: number;
    private _type: number;
    private _color: number;
    private _brightness: number;

    constructor(id: number, type: number, color: number, brightness: number)
    {
        this._id = id;
        this._type = type;
        this._color = color;
        this._brightness = brightness;
    }

    public get id(): number
    {
        return this._id;
    }

    public get type(): number
    {
        return this._type;
    }

    public get color(): number
    {
        return this._color;
    }

    public get brightness(): number
    {
        return this._brightness;
    }
}
