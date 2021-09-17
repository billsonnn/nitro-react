export class MessengerChatMessage
{
    private _type: number;
    private _senderId: number;
    private _message: string;
    private _sentAt: number;
    private _extraData: string;

    constructor(type: number, senderId: number, message: string, sentAt: number, extraData?: string)
    {
        this._type = type;
        this._senderId = senderId;
        this._message = message;
        this._sentAt = sentAt;
        this._extraData = extraData;
    }

    public get type(): number
    {
        return this._type;
    }

    public get senderId(): number
    {
        return this._senderId;
    }

    public get message(): string
    {
        return this._message;
    }

    public get sentAt(): number
    {
        return this._sentAt;
    }

    public get extraData(): string
    {
        return this._extraData;
    }
}
