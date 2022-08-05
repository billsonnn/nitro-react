import { FC } from 'react';
import { createPortal } from 'react-dom';
import { useFriends } from '../../hooks';
import { FriendBarView } from './views/friends-bar/FriendsBarView';
import { FriendsListView } from './views/friends-list/FriendsListView';
import { FriendsMessengerView } from './views/messenger/FriendsMessengerView';

export const FriendsView: FC<{}> = props =>
{
    const { settings = null, onlineFriends = [] } = useFriends();

    if(!settings) return null;

    return (
        <>
            { createPortal(<FriendBarView onlineFriends={ onlineFriends } />, document.getElementById('toolbar-friend-bar-container')) }
            <FriendsListView />
            <FriendsMessengerView />
        </>
    );
}
