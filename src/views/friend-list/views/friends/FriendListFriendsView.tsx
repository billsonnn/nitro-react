import { FC, useMemo } from 'react';
import { useFriendListContext } from '../../context/FriendListContext';
import { FriendListFriendsItemView } from '../friends-item/FriendListFriendsItemView';
import { FriendListFriendsViewProps } from './FriendListFriendsView.types';

export const FriendListFriendsView: FC<FriendListFriendsViewProps> = props =>
{
    const { online = true } = props;
    const { friendListState = null } = useFriendListContext();
    const { friends = null } = friendListState;

    const getFriendElements = useMemo(() =>
    {
        if(!friends || !friends.length) return null;

        const elements: JSX.Element[] = [];

        for(const friend of friends)
        {
            if(!friend || (friend.online !== online)) continue;

            elements.push(<FriendListFriendsItemView key={ friend.id } friend={ friend } />)
        }

        console.log(elements);

        return elements;
    }, [ friends, online ]);

    return (
        <div className="d-flex flex-column">
            { getFriendElements }
        </div>
    );
}
