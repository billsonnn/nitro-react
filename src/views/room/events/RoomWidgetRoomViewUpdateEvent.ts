import { NitroPoint, NitroRectangle } from 'nitro-renderer';
import { RoomWidgetUpdateEvent } from './RoomWidgetUpdateEvent';

export class RoomWidgetRoomViewUpdateEvent extends RoomWidgetUpdateEvent
{
    public static SIZE_CHANGED: string      = 'RWRVUE_ROOM_VIEW_SIZE_CHANGED';
    public static SCALE_CHANGED: string     = 'RWRVUE_ROOM_VIEW_SCALE_CHANGED';
    public static POSITION_CHANGED: string  = 'RWRVUE_ROOM_VIEW_POSITION_CHANGED';

    private _roomViewRectangle: NitroRectangle;
    private _positionDelta: NitroPoint;
    private _scale: number;

    constructor(type: string, view: NitroRectangle = null, position: NitroPoint = null, scale: number = 0)
    {
        super(type);

        this._roomViewRectangle = view;
        this._positionDelta     = position;
        this._scale             = scale;
    }

    public get roomViewRectangle(): NitroRectangle
    {
        if(!this._roomViewRectangle) return null;

        return this._roomViewRectangle.clone();
    }

    public get positionDelta(): NitroPoint
    {
        if(!this._positionDelta) return null;

        return this._positionDelta.clone();
    }

    public get scale(): number
    {
        return this._scale;
    }
}
