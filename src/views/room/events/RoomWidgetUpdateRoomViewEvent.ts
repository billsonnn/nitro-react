import { NitroRectangle } from '@nitrots/nitro-renderer';
import { RoomWidgetUpdateEvent } from './RoomWidgetUpdateEvent';

export class RoomWidgetUpdateRoomViewEvent extends RoomWidgetUpdateEvent
{
    public static SIZE_CHANGED: string = 'RWURVE_SIZE_CHANGED';

    private _roomViewRectangle: NitroRectangle;

    constructor(type: string, view: NitroRectangle)
    {
        super(type);

        this._roomViewRectangle = view;
    }

    public get roomViewRectangle(): NitroRectangle
    {
        return this._roomViewRectangle;
    }
}
