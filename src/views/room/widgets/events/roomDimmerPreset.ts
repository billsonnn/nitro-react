// see _Str_6094
export class RoomDimmerPreset
{
    private _id: number = 0;
    private _type: number = 0;
    private _color: number = 0;
    private _intensity: number = 0;

    constructor(k: number, _arg_2: number, _arg_3: number, _arg_4: number)
    {
        this._id = k;
        this._type = _arg_2;
        this._color = _arg_3;
        this._intensity = _arg_4;
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
