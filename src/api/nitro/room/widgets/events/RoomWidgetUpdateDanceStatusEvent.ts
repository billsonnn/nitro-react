import { RoomWidgetUpdateEvent } from './RoomWidgetUpdateEvent';

export class RoomWidgetUpdateDanceStatusEvent extends RoomWidgetUpdateEvent
{
    public static UPDATE_DANCE: string = 'RWUDSE_UPDATE_DANCE';

    private _isDancing: boolean;

    constructor(isDancing: boolean)
    {
        super(RoomWidgetUpdateDanceStatusEvent.UPDATE_DANCE);

        this._isDancing = isDancing;
    }

    public get isDancing(): boolean
    {
        return this._isDancing;
    }
}
