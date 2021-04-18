import { RoomWidgetUpdateEvent } from 'nitro-renderer';

export class RoomWidgetDanceUpdateEvent extends RoomWidgetUpdateEvent
{
    public static RWUE_DANCE: string = 'RWUE_DANCE';

    private _style: number;

    constructor(k: number)
    {
        super(RoomWidgetDanceUpdateEvent.RWUE_DANCE);

        this._style = k;
    }

    public get style(): number
    {
        return this._style;
    }
}
