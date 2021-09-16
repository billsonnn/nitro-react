import { RoomWidgetMessage } from './RoomWidgetMessage';

export class RoomWidgetDimmerSavePresetMessage extends RoomWidgetMessage
{
    public static SAVE_PRESET: string = 'RWSDPM_SAVE_PRESET';

    private _presetNumber: number;
    private _effectTypeId: number;
    private _color: number;
    private _brightness: number;
    private _apply: boolean;

    constructor(presetNumber: number, effectTypeId: number, color: number, brightness: number, apply: boolean)
    {
        super(RoomWidgetDimmerSavePresetMessage.SAVE_PRESET);

        this._presetNumber = presetNumber;
        this._effectTypeId = effectTypeId;
        this._color = color;
        this._brightness = brightness;
        this._apply = apply;
    }

    public get presetNumber(): number
    {
        return this._presetNumber;
    }

    public get effectTypeId(): number
    {
        return this._effectTypeId;
    }

    public get color(): number
    {
        return this._color;
    }

    public get brightness(): number
    {
        return this._brightness;
    }

    public get apply(): boolean
    {
        return this._apply;
    }
}
