import { RoomWidgetUpdateEvent } from 'nitro-renderer';

export class RoomWidgetRoomObjectUpdateEvent extends RoomWidgetUpdateEvent
{
    public static OBJECT_SELECTED: string               = 'RWROUE_OBJECT_SELECTED';
    public static OBJECT_DESELECTED: string             = 'RWROUE_OBJECT_DESELECTED';
    public static USER_REMOVED: string                  = 'RWROUE_USER_REMOVED';
    public static FURNI_REMOVED: string                 = 'RWROUE_FURNI_REMOVED';
    public static FURNI_ADDED: string                   = 'RWROUE_FURNI_ADDED';
    public static USER_ADDED: string                    = 'RWROUE_USER_ADDED';
    public static OBJECT_ROLL_OVER: string              = 'RWROUE_OBJECT_ROLL_OVER';
    public static OBJECT_ROLL_OUT: string               = 'RWROUE_OBJECT_ROLL_OUT';
    public static OBJECT_REQUEST_MANIPULATION: string   = 'RWROUE_OBJECT_REQUEST_MANIPULATION';

    private _id: number;
    private _category: number;
    private _roomId: number;

    constructor(type: string, id: number, category: number, roomId: number)
    {
        super(type);

        this._id        = id;
        this._category  = category;
        this._roomId    = roomId;
    }

    public get id(): number
    {
        return this._id;
    }

    public get category(): number
    {
        return this._category;
    }

    public get roomId(): number
    {
        return this._roomId;
    }
}
