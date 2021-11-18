import { NitroEvent } from '@nitrots/nitro-renderer';

export class FriendsDeclineFriendRequestEvent extends NitroEvent
{
    public static DECLINE_FRIEND_REQUEST: string = 'FAFRE_DECLINE_FRIEND_REQUEST';

    private _requestId: number;

    constructor(requestId: number)
    {
        super(FriendsDeclineFriendRequestEvent.DECLINE_FRIEND_REQUEST);

        this._requestId = requestId;
    }

    public get requestId(): number
    {
        return this._requestId;
    }
}
