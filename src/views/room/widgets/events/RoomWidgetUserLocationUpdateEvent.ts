import { RoomWidgetUpdateEvent } from 'nitro-renderer';
import { Point, Rectangle } from 'pixi.js';

export class RoomWidgetUserLocationUpdateEvent extends RoomWidgetUpdateEvent
{
    public static RWULUE_USER_LOCATION_UPDATE: string = 'RWULUE_USER_LOCATION_UPDATE';

    private _userId: number;
    private _rectangle: Rectangle;
    private _Str_20775: Point;

    constructor(k: number, _arg_2: Rectangle, _arg_3: Point)
    {
        super(RoomWidgetUserLocationUpdateEvent.RWULUE_USER_LOCATION_UPDATE);

        this._userId = k;
        this._rectangle = _arg_2;
        this._Str_20775 = _arg_3;
    }

    public get userId(): number
    {
        return this._userId;
    }

    public get rectangle(): Rectangle
    {
        return this._rectangle;
    }

    public get _Str_9337(): Point
    {
        return this._Str_20775;
    }
}
