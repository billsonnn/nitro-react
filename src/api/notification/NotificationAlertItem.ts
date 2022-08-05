import { NotificationAlertType } from './NotificationAlertType';

export class NotificationAlertItem
{
    private static ITEM_ID: number = -1;

    private _id: number;
    private _messages: string[];
    private _alertType: string;
    private _clickUrl: string;
    private _clickUrlText: string;
    private _title: string;
    private _imageUrl: string;

    constructor(messages: string[], alertType: string = NotificationAlertType.DEFAULT, clickUrl: string = null, clickUrlText: string = null, title: string = null, imageUrl: string = null)
    {
        NotificationAlertItem.ITEM_ID += 1;

        this._id = NotificationAlertItem.ITEM_ID;
        this._messages = messages;
        this._alertType = alertType;
        this._clickUrl = clickUrl;
        this._clickUrlText = clickUrlText;
        this._title = title;
        this._imageUrl = imageUrl;
    }

    public get id(): number
    {
        return this._id;
    }

    public get messages(): string[]
    {
        return this._messages;
    }

    public set alertType(alertType: string)
    {
        this._alertType = alertType;
    }

    public get alertType(): string
    {
        return this._alertType;
    }

    public get clickUrl(): string
    {
        return this._clickUrl;
    }

    public get clickUrlText(): string
    {
        return this._clickUrlText;
    }

    public get title(): string
    {
        return this._title;
    }

    public get imageUrl(): string
    {
        return this._imageUrl;
    }
}
