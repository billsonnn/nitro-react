import { NitroEvent } from '@nitrots/nitro-renderer';

export class NotificationBubbleEvent extends NitroEvent
{
    public static NEW_BUBBLE: string = 'NBE_NEW_BUBBLE';

    private _message: string;
    private _notificationType: string;
    private _imageUrl: string;
    private _linkUrl: string;

    constructor(message: string, notificationType: string, imageUrl: string, linkUrl: string)
    {
        super(NotificationBubbleEvent.NEW_BUBBLE);

        this._message = message;
        this._notificationType = notificationType;
        this._imageUrl = imageUrl;
        this._linkUrl = linkUrl;
    }

    public get message(): string
    {
        return this._message;
    }

    public get notificationType(): string
    {
        return this._notificationType;
    }

    public get imageUrl(): string
    {
        return this._imageUrl;
    }

    public get linkUrl(): string
    {
        return this._linkUrl;
    }
}
