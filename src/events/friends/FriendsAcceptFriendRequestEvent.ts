import { NitroEvent } from '@nitrots/nitro-renderer';

export class FriendsAcceptFriendRequestEvent extends NitroEvent
{
    public static ACCEPT_FRIEND_REQUEST: string = 'FAFRE_ACCEPT_FRIEND_REQUEST';

    private _requestId: number;

    constructor(requestId: number)
    {
        super(FriendsAcceptFriendRequestEvent.ACCEPT_FRIEND_REQUEST);

        this._requestId = requestId;
    }

    public get requestId(): number
    {
        return this._requestId;
    }
}
