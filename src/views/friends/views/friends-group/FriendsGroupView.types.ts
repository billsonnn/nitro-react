import { MessengerFriend } from '../../common/MessengerFriend';

export interface FriendsGroupViewProps
{
    list: MessengerFriend[];
    selectedFriendsIds: number[];
    selectFriend: (userId: number) => void;
}
