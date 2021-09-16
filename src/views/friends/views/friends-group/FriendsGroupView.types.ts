import { MessengerFriend } from '../../common/MessengerFriend';
import { MessengerRequest } from '../../common/MessengerRequest';

export interface FriendsGroupViewProps
{
    list: MessengerFriend[] | MessengerRequest[];
}
