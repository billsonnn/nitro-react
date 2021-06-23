import { FC } from 'react';
import { useFriendListContext } from '../../context/FriendListContext';
import { FriendBarItemView } from '../friend-bar-item/FriendBarItemView';
import { FriendBarViewProps } from './FriendBarView.types';

export const FriendBarView: FC<FriendBarViewProps> = props =>
{
    const { friendListState = null } = useFriendListContext();
    const { friends = null } = friendListState;

    return (
        <div>
            { friends.map((friend, index) =>
                {
                    return <FriendBarItemView key={ index } friend={ friend } />
                })}
        </div>
    );
}
