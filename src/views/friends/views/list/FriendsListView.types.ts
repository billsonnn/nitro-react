import { MessengerFriend } from '../../common/MessengerFriend';
import { MessengerRequest } from '../../common/MessengerRequest';

export interface FriendsListViewProps
{
    list: MessengerFriend[] | MessengerRequest[];
}
