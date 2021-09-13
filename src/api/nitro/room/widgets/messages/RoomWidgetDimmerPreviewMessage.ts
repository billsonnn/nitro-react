import { RoomWidgetMessage } from './RoomWidgetMessage';

export class RoomWidgetDimmerPreviewMessage extends RoomWidgetMessage
{
    public static PREVIEW_DIMMER_PRESET: string = 'RWDPM_PREVIEW_DIMMER_PRESET';

    private _color: number;
    private _brightness: number;
    private _bgOnly: boolean;

    constructor(color: number, brightness: number, bgOnly: boolean)
    {
        super(RoomWidgetDimmerPreviewMessage.PREVIEW_DIMMER_PRESET);

        this._color = color;
        this._brightness = brightness;
        this._bgOnly = bgOnly;
    }

    public get color(): number
    {
        return this._color;
    }

    public get brightness(): number
    {
        return this._brightness;
    }

    public get bgOnly(): boolean
    {
        return this._bgOnly;
    }
}
