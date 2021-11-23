import { NitroLayoutFlexProps } from '../../../../layout';
import { MessengerFriend } from '../../common/MessengerFriend';

export interface FriendsGroupItemViewProps extends NitroLayoutFlexProps
{
    friend: MessengerFriend;
    selected?: boolean;
}
