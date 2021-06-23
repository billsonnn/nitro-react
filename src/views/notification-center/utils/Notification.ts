export class NitroNotification
{
    public static CURRENT_ID: number = 0;

    private _id: number;
    private _title: string;
    private _message: string;
    private _dismissed: boolean = false;
    private _timestamp: number;

    constructor(message: string = null, title: string = null)
    {
        this._id = ++NitroNotification.CURRENT_ID;
        this._title = title;
        this._timestamp = Date.now();

        if(message) this._message = message.replace(/\r\n|\r|\n/g, '<br />');
    }

    public dismiss(): void
    {
        this._dismissed = true;
    }

    public get id(): number
    {
        return this._id;
    }

    public get title(): string
    {
        return this._title;
    }

    public get message(): string
    {
        return this._message;
    }

    public get dismissed(): boolean
    {
        return this._dismissed;
    }

    public get timestamp(): number
    {
        return this._timestamp;
    }
}
