import { RoomWidgetUpdateEvent } from './RoomWidgetUpdateEvent';

export class RoomWidgetUpdateRoomObjectEvent extends RoomWidgetUpdateEvent
{
    public static OBJECT_SELECTED: string = 'RWUROE_OBJECT_SELECTED';
    public static OBJECT_DESELECTED: string = 'RWUROE_OBJECT_DESELECTED';
    public static USER_REMOVED: string = 'RWUROE_USER_REMOVED';
    public static FURNI_REMOVED: string = 'RWUROE_FURNI_REMOVED';
    public static FURNI_ADDED: string = 'RWUROE_FURNI_ADDED';
    public static USER_ADDED: string = 'RWUROE_USER_ADDED';
    public static OBJECT_ROLL_OVER: string = 'RWUROE_OBJECT_ROLL_OVER';
    public static OBJECT_ROLL_OUT: string = 'RWUROE_OBJECT_ROLL_OUT';
    public static OBJECT_REQUEST_MANIPULATION: string = 'RWUROE_OBJECT_REQUEST_MANIPULATION';
    public static OBJECT_DOUBLE_CLICKED: string = 'RWUROE_OBJECT_DOUBLE_CLICKED';

    private _id: number;
    private _category: number;
    private _roomId: number;

    constructor(type: string, id: number, category: number, roomId: number)
    {
        super(type);

        this._id = id;
        this._category = category;
        this._roomId = roomId;
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
