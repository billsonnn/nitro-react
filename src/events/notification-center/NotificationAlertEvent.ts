import { NitroEvent } from '@nitrots/nitro-renderer';

export class NotificationAlertEvent extends NitroEvent
{
    public static ALERT: string = 'NAE_ALERT';

    private _messages: string[];
    private _alertType: string;
    private _clickUrl: string;
    private _clickUrlText: string;
    private _title: string;
    private _imageUrl: string;

    constructor(messages: string[], alertType: string = null, clickUrl: string = null, clickUrlText: string = null, title: string = null, imageUrl: string = null)
    {
        super(NotificationAlertEvent.ALERT);

        this._messages = messages;
        this._alertType = alertType;
        this._clickUrl = clickUrl;
        this._clickUrlText = clickUrlText;
        this._title = title;
        this._imageUrl = imageUrl;
    }

    public get messages(): string[]
    {
        return this._messages;
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
