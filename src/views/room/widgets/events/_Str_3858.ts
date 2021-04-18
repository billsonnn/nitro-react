export class _Str_3858
{
    private _id: number;
    private _category: number;
    private _name: string;
    private _Str_3748: number;
    private _Str_4105: number;
    private _Str_21788: number;
    private _replace: boolean;

    constructor(k: number, _arg_2: number, _arg_3: string, _arg_4: number, _arg_5: number, _arg_6: number=-1, _arg_7: boolean = false)
    {
        this._id = k;
        this._category = _arg_2;
        this._name = _arg_3;
        this._Str_3748 = _arg_4;
        this._Str_4105 = _arg_5;
        this._Str_21788 = _arg_6;
        this._replace = _arg_7;
    }

    public dispose(): void
    {
    }

    public get id(): number
    {
        return this._id;
    }

    public get category(): number
    {
        return this._category;
    }

    public get name(): string
    {
        return this._name;
    }

    public get _Str_3710(): number
    {
        return this._Str_3748;
    }

    public get _Str_5563(): number
    {
        return this._Str_4105;
    }

    public get _Str_24139(): number
    {
        return this._Str_21788;
    }

    public get replace(): boolean
    {
        return this._replace;
    }
}