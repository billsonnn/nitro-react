import { RoomWidgetUpdateEvent } from 'nitro-renderer';

export class RoomWidgetFriendRequestUpdateEvent extends RoomWidgetUpdateEvent
{
    public static RWFRUE_SHOW_FRIEND_REQUEST: string = 'RWFRUE_SHOW_FRIEND_REQUEST';
    public static RWFRUE_HIDE_FRIEND_REQUEST: string = 'RWFRUE_HIDE_FRIEND_REQUEST';

    private _requestId: number;
    private _userId: number;
    private _userName: string;

    constructor(type: string, requestId: number, userId: number = 0, userName: string = null)
    {
        super(type);

        this._requestId = requestId;
        this._userId = userId;
        this._userName = userName;
    }

    public get requestId(): number
    {
        return this._requestId;
    }

    public get userId(): number
    {
        return this._userId;
    }

    public get userName(): string
    {
        return this._userName;
    }
}
