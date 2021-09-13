export class RoomDimmerPreset
{
    private _id: number = 0;
    private _type: number = 0;
    private _color: number = 0;
    private _intensity: number = 0;

    constructor(id: number, type: number, color: number, intensity: number)
    {
        this._id = id;
        this._type = type;
        this._color = color;
        this._intensity = intensity;
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

    public get _Str_4272(): number
    {
        return this._intensity;
    }
}
