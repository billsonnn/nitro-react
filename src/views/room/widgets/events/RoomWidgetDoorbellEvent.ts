import { RoomWidgetUpdateEvent } from 'nitro-renderer';

export class RoomWidgetDoorbellEvent extends RoomWidgetUpdateEvent
{
    public static RWDE_RINGING: string = 'RWDE_RINGING';
    public static REJECTED: string = 'RWDE_REJECTED';
    public static RWDE_ACCEPTED: string = 'RWDE_ACCEPTED';

    private _userName: string = '';

    constructor(k: string, _arg_2: string)
    {
        super(k);

        this._userName = _arg_2;
    }

    public get userName(): string
    {
        return this._userName;
    }
}
