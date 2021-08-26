import { NitroEvent } from '@nitrots/nitro-renderer';

export class SimpleAlertUIEvent extends NitroEvent
{
    public static ALERT: string = 'SAUE_ALERT';

    private _message: string;
    private _clickUrl: string;
    private _clickUrlText: string;
    private _title: string;
    private _imageUrl: string;

    constructor(message: string, clickUrl: string = null, clickUrlText: string = null, title: string = null, imageUrl: string = null)
    {
        super(SimpleAlertUIEvent.ALERT);

        this._message = message;
        this._clickUrl = clickUrl;
        this._clickUrlText = clickUrlText;
        this._title = title;
        this._imageUrl = imageUrl;
    }

    public get message(): string
    {
        return this._message;
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
