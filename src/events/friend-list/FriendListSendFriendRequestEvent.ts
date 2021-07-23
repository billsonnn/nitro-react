import { FriendListEvent } from './FriendListEvent';

export class FriendListSendFriendRequestEvent extends FriendListEvent
{
    public static SEND_FRIEND_REQUEST: string = 'FLSFRE_SEND_FRIEND_REQUEST';

    private _userId: number;

    constructor(userId: number)
    {
        super(FriendListSendFriendRequestEvent.SEND_FRIEND_REQUEST);

        this._userId = userId;
    }

    public get userId(): number
    {
        return this._userId;
    }
}
