import { RoomWidgetUpdateEvent } from 'nitro-renderer';

export class RoomWidgetFloodControlEvent extends RoomWidgetUpdateEvent
{
    public static RWFCE_FLOOD_CONTROL: string = 'RWFCE_FLOOD_CONTROL';

    private _seconds: number = 0;

    constructor(k: number)
    {
        super(RoomWidgetFloodControlEvent.RWFCE_FLOOD_CONTROL);

        this._seconds = k;
    }

    public get seconds(): number
    {
        return this._seconds;
    }
}
