export class NitroNotification
{
    public static CURRENT_ID: number = 0;

    private _id: number;
    private _title: string;
    private _message: string;

    constructor(message: string = null, title: string = null)
    {
        this._id = ++NitroNotification.CURRENT_ID;
        this._title = title;

        if(message) this._message = message.replace(/\r\n|\r|\n/g, '<br />');
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
}
