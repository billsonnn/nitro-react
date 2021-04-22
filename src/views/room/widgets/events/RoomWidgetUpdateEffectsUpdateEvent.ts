import { RoomWidgetUpdateEvent } from 'nitro-renderer';

export class RoomWidgetUpdateEffectsUpdateEvent extends RoomWidgetUpdateEvent
{
    public static RWUEUE_UPDATE_EFFECTS: string = 'RWUEUE_UPDATE_EFFECTS';

    private _effects: number[];

    constructor(k: number[] = null)
    {
        super(RoomWidgetUpdateEffectsUpdateEvent.RWUEUE_UPDATE_EFFECTS);

        this._effects = k;
    }

    public get effects(): number[]
    {
        return this._effects;
    }
}
