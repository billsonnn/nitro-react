import { MessengerFriend } from '../../views/friends/common/MessengerFriend';
import { FriendsEvent } from './FriendsEvent';

export class FriendListContentEvent extends FriendsEvent
{
    public static FRIEND_LIST_CONTENT: string = 'FLSFRE_FRIEND_LIST_CONTENT';

    private _friends: Map<number, string>;

    constructor(friends: MessengerFriend[])
    {
        super(FriendListContentEvent.FRIEND_LIST_CONTENT);

        this._friends = new Map();

        friends.forEach(entry => 
        {
            this._friends.set(entry.id, entry.name);
        });
    }

    public get friends(): Map<number, string>
    {
        return this._friends;
    }
}
