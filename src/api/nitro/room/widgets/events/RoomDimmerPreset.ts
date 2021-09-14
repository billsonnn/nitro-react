export class RoomDimmerPreset
{
    private _id: number;
    private _bgOnly: boolean;
    private _color: string;
    private _brightness: number;

    constructor(id: number, bgOnly: boolean, color: string, brightness: number)
    {
        this._id = id;
        this._bgOnly = bgOnly;
        this._color = color;
        this._brightness = brightness;
    }

    public get id(): number
    {
        return this._id;
    }

    public get bgOnly(): boolean
    {
        return this._bgOnly;
    }

    public get color(): string
    {
        return this._color;
    }

    public get brightness(): number
    {
        return this._brightness;
    }
}
