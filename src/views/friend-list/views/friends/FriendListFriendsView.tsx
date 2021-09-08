import { FC } from 'react';
import { FriendListFriendsItemView } from '../friends-item/FriendListFriendsItemView';
import { FriendListFriendsViewProps } from './FriendListFriendsView.types';

export const FriendListFriendsView: FC<FriendListFriendsViewProps> = props =>
{
    const { list = null } = props;

    if(!list) return null;

    return (<>
        { list.map((friend, index) =>
        {
            return <FriendListFriendsItemView key={ index } friend={ friend } />
        }) }
    </>);
}
