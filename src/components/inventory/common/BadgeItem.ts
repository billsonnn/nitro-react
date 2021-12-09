export class BadgeItem
{
    private _code: string;
    private _isUnseen: boolean;

    constructor(code: string)
    {
        this._code = code;
        this._isUnseen = false;
    }

    public get code(): string
    {
        return this._code;
    }

    public get isUnseen(): boolean
    {
        return this._isUnseen;
    }

    public set isUnseen(flag: boolean)
    {
        this._isUnseen = flag;
    }
}
