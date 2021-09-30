import { RoomDimmerPreset } from './RoomDimmerPreset';
import { RoomWidgetUpdateEvent } from './RoomWidgetUpdateEvent';

export class RoomWidgetUpdateDimmerEvent extends RoomWidgetUpdateEvent
{
    public static PRESETS: string = 'RWUDE_PRESETS';
    public static HIDE: string = 'RWUDE_HIDE';

    private _selectedPresetId: number = 0;
    private _presets: RoomDimmerPreset[];

    constructor(type: string)
    {
        super(type);

        this._presets = [];
    }

    public get presetCount(): number
    {
        return this._presets.length;
    }

    public get presets(): RoomDimmerPreset[]
    {
        return this._presets;
    }

    public get selectedPresetId(): number
    {
        return this._selectedPresetId;
    }

    public set selectedPresetId(k: number)
    {
        this._selectedPresetId = k;
    }

    public setPresetValues(id: number, type: number, color: number, brightness: number): void
    {
        const preset = new RoomDimmerPreset(id, type, color, brightness);

        this._presets[(id - 1)] = preset;
    }

    public getPresetNumber(id: number): RoomDimmerPreset
    {
        return this._presets[id];
    }
}
