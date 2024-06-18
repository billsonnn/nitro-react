export class GuideToolMessage
{
    private _message: string;
    private _roomId: number;

    constructor(message: string, roomId?: number)
    {
        this._message = message;
        this._roomId = roomId;
    }

    public get message(): string
    {
        return this._message;
    }

    public get roomId(): number
    {
        return this._roomId;
    }
}
