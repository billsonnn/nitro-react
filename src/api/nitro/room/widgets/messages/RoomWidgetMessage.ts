export class RoomWidgetMessage
{
    private _type: string;

    constructor(type: string)
    {
        this._type = type;
    }

    public get type(): string
    {
        return this._type;
    }
}
