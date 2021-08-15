import { NitroEvent } from '@nitrots/nitro-renderer';

export class NotificationCenterAlertEvent extends NitroEvent
{
    public static HOTEL_ALERT: string = 'NCAE_HOTEL_ALERT';

    private _message: string[];
    private _clickUrl: string;
    private _headerText: string;

    constructor(type: string, message: string[], clickUrl = null, headerText = null)
    {
        super(type);

        this._message = message;
        this._clickUrl = clickUrl;
        this._headerText = headerText;
    }

    public get message(): string[]
    {
        return this._message;
    }

    public get clickUrl(): string
    {
        return this._clickUrl;
    }

    public get headerText(): string
    {
        return this._headerText;
    }
}
