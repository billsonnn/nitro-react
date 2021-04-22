import { RoomWidgetUpdateEvent } from 'nitro-renderer';
import { RoomDimmerPreset } from './roomDimmerPreset';

export class RoomWidgetDimmerUpdateEvent extends RoomWidgetUpdateEvent
{
    public static RWDUE_PRESETS: string = 'RWDUE_PRESETS';
    public static RWDUE_HIDE: string = 'RWDUE_HIDE';

    private _selectedPresetId: number = 0;
    private _presets: RoomDimmerPreset[];

    constructor(k: string)
    {
        super(k);

        this._presets = [];
    }

    public get _Str_10888(): number
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

    public setPresetValues(k: number, _arg_2: number, _arg_3: number, _arg_4: number):void
    {
        const _local_5 = new RoomDimmerPreset(k, _arg_2, _arg_3, _arg_4);

        this._presets[(k - 1)] = _local_5;
    }

    //_Str_14989
    public getPresetNumber(k: number): RoomDimmerPreset
    {
        if(((k < 0) || (k >= this._presets.length))) return null;

        return this._presets[k];
    }
}
