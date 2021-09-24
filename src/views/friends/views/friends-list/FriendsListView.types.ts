import { MessengerFriend } from './../../common/MessengerFriend';
import { MessengerRequest } from './../../common/MessengerRequest';
export interface FriendsListViewProps
{
    onCloseClick: () => void;
    onlineFriends: MessengerFriend[];
    offlineFriends: MessengerFriend[];
    friendRequests: MessengerRequest[];
}
