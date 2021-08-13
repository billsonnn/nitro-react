import { RoomWidgetUpdateEvent } from './RoomWidgetUpdateEvent';

export class RoomWidgetDoorbellEvent extends RoomWidgetUpdateEvent
{
    public static RINGING: string = 'RWDE_RINGING';
    public static REJECTED: string = 'RWDE_REJECTED';
    public static ACCEPTED: string = 'RWDE_ACCEPTED';

    private _userName: string = '';

    constructor(type: string, userName: string)
    {
        super(type);

        this._userName = userName;
    }

    public get userName(): string
    {
        return this._userName;
    }
}
