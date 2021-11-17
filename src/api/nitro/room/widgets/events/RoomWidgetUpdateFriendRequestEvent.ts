import { RoomWidgetUpdateEvent } from './RoomWidgetUpdateEvent';

export class RoomWidgetUpdateFriendRequestEvent extends RoomWidgetUpdateEvent
{
    public static SHOW_FRIEND_REQUEST: string = 'RWFRUE_SHOW_FRIEND_REQUEST';
    public static HIDE_FRIEND_REQUEST: string = 'RWFRUE_HIDE_FRIEND_REQUEST';

    private _requestId: number;
    private _userId: number;
    private _userName: string;

    constructor(type: string, requestId: number = -1, userId: number = -1, userName: string = null)
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
