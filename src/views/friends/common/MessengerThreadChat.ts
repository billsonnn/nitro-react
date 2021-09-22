export class MessengerThreadChat
{
    public static CHAT: number = 0;
    public static ROOM_INVITE: number = 1;
    public static STATUS_NOTIFICATION: number = 2;
    public static SECURITY_NOTIFICATION: number = 3;

    private _type: number;
    private _senderId: number;
    private _message: string;
    private _secondsSinceSent: number;
    private _extraData: string;
    private _date: Date;

    constructor(senderId: number, message: string, secondsSinceSent: number = 0, extraData: string = null, type: number = 0)
    {
        this._type = type;
        this._senderId = senderId;
        this._message = message;
        this._secondsSinceSent = secondsSinceSent;
        this._extraData = extraData;
        this._date = new Date();
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

    public get secondsSinceSent(): number
    {
        return this._secondsSinceSent;
    }

    public get extraData(): string
    {
        return this._extraData;
    }

    public get date(): Date
    {
        return this._date;
    }
}
