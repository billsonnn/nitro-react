import { FC } from 'react';
import { FriendListFriendsItemViewProps } from './FriendListFriendsItemView.types';

export const FriendListFriendsItemView: FC<FriendListFriendsItemViewProps> = props =>
{
    const { friend = null } = props;

    return (
        <div className="d-flex">
            <div className="text-black">{ friend.name }</div>
        </div>
    );
}
