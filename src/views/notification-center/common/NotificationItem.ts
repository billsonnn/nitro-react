import { NotificationType } from './NotificationType';

export class NotificationItem
{
    private static ITEM_ID: number = -1;

    private _id: number;
    private _message: string;
    private _notificationType: string;
    private _iconUrl: string;
    private _linkUrl: string;

    constructor(message: string, notificationType: string = NotificationType.INFO, iconUrl: string = null, linkUrl: string = null)
    {
        NotificationItem.ITEM_ID += 1;

        this._id = NotificationItem.ITEM_ID;
        this._message = message;
        this._notificationType = notificationType;
        this._iconUrl = iconUrl;
        this._linkUrl = linkUrl;
    }

    public get id(): number
    {
        return this._id;
    }

    public get message(): string
    {
        return this._message;
    }

    public get notificationType(): string
    {
        return this._notificationType;
    }

    public get iconUrl(): string
    {
        return this._iconUrl;
    }

    public get linkUrl(): string
    {
        return this._linkUrl;
    }
}
