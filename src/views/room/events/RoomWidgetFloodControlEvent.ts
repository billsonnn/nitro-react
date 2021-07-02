import { RoomWidgetUpdateEvent } from './RoomWidgetUpdateEvent';

export class RoomWidgetFloodControlEvent extends RoomWidgetUpdateEvent
{
    public static FLOOD_CONTROL: string = 'RWFCE_FLOOD_CONTROL';

    private _seconds: number = 0;

    constructor(k: number)
    {
        super(RoomWidgetFloodControlEvent.FLOOD_CONTROL);

        this._seconds = k;
    }

    public get seconds(): number
    {
        return this._seconds;
    }
}
