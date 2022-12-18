export class Tile
{
    private _height: string;
    private _isBlocked: boolean;

    constructor(height: string, isBlocked: boolean)
    {
        this._height = height;
        this._isBlocked = isBlocked;
    }

    public get height(): string
    {
        return this._height;
    }

    public set height(height: string)
    {
        this._height = height;
    }

    public get isBlocked(): boolean
    {
        return this._isBlocked;
    }

    public set isBlocked(val: boolean)
    {
        this._isBlocked = val;
    }
}
