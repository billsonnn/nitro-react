import { RoomWidgetUpdateEvent } from 'nitro-renderer';
import { Point, Rectangle } from 'pixi.js';

export class RoomWidgetRoomViewUpdateEvent extends RoomWidgetUpdateEvent
{
    public static SIZE_CHANGED: string      = 'RWRVUE_ROOM_VIEW_SIZE_CHANGED';
    public static SCALE_CHANGED: string     = 'RWRVUE_ROOM_VIEW_SCALE_CHANGED';
    public static POSITION_CHANGED: string  = 'RWRVUE_ROOM_VIEW_POSITION_CHANGED';

    private _roomViewRectangle: Rectangle;
    private _positionDelta: Point;
    private _scale: number;

    constructor(type: string, view: Rectangle = null, position: Point = null, scale: number = 0)
    {
        super(type);

        this._roomViewRectangle = view;
        this._positionDelta     = position;
        this._scale             = scale;
    }

    public get roomViewRectangle(): Rectangle
    {
        if(!this._roomViewRectangle) return null;

        return this._roomViewRectangle.clone();
    }

    public get positionDelta(): Point
    {
        if(!this._positionDelta) return null;

        return this._positionDelta.clone();
    }

    public get scale(): number
    {
        return this._scale;
    }
}
