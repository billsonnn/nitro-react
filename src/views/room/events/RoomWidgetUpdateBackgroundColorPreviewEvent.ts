import { RoomWidgetUpdateEvent } from './RoomWidgetUpdateEvent';

export class RoomWidgetUpdateBackgroundColorPreviewEvent extends RoomWidgetUpdateEvent
{
    public static PREVIEW = 'RWUBCPE_PREVIEW';
    public static CLEAR_PREVIEW = 'RWUBCPE_CLEAR_PREVIEW';

    private _hue: number;
    private _saturation: number;
    private _lightness: number;

    constructor(type: string, hue: number = 0, saturation: number = 0, lightness: number = 0)
    {
        super(type);

        this._hue = hue;
        this._saturation = saturation;
        this._lightness = lightness;
    }

    public get hue(): number
    {
        return this._hue;
    }

    public get saturation(): number
    {
        return this._saturation;
    }

    public get lightness(): number
    {
        return this._lightness;
    }
}
