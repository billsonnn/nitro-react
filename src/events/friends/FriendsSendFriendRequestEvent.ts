import { NitroEvent } from '@nitrots/nitro-renderer';

export class FriendsSendFriendRequestEvent extends NitroEvent
{
    public static SEND_FRIEND_REQUEST: string = 'FLSFRE_SEND_FRIEND_REQUEST';

    private _userId: number;
    private _userName: string;

    constructor(userId: number, userName: string)
    {
        super(FriendsSendFriendRequestEvent.SEND_FRIEND_REQUEST);

        this._userId = userId;
        this._userName = userName;
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
