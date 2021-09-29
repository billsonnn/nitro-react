import { RoomWidgetUpdateEvent } from './RoomWidgetUpdateEvent';

export class RoomWidgetUpdateDecorateModeEvent extends RoomWidgetUpdateEvent
{
    public static UPDATE_DECORATE: string = 'RWUDME_UPDATE_DECORATE';

    private _isDecorating: boolean;

    constructor(isDecorating: boolean)
    {
        super(RoomWidgetUpdateDecorateModeEvent.UPDATE_DECORATE);

        this._isDecorating = isDecorating;
    }

    public get isDecorating(): boolean
    {
        return this._isDecorating;
    }
}
