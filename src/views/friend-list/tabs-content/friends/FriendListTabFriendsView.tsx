import classNames from 'classnames';
import { FC, useContext, useState } from 'react';
import { FriendListContext } from '../../FriendListView';
import { FriendListTabFriendsViewProps } from './FriendListTabFriendsView.types';

export const FriendListTabFriendsView: FC<FriendListTabFriendsViewProps> = props =>
{
    const friendListContext = useContext(FriendListContext);

    const [ isOnlineFriendsExtended, setIsOnlineFriendsExtended ] = useState(false);
    const [ isOfflineFriendsExtended, setIsOfflineFriendsExtended ] = useState(false);

    function toggleOnlineFriends(): void
    {
        setIsOnlineFriendsExtended(value => !value);
    }

    function toggleOfflineFriends(): void
    {
        setIsOfflineFriendsExtended(value => !value);
    }

    return (
        <div>
            <div className="d-flex mb-2 small">
                <i className={ "fas " + classNames({ 'fa-plus': !isOnlineFriendsExtended, 'fa-minus': isOnlineFriendsExtended })} onClick={ toggleOnlineFriends }></i>
                <div className="align-self-center w-100 ml-2">Friends (0)</div>
            </div>
            <div className="d-flex mb-2 small">
                <i className={ "fas " + classNames({ 'fa-plus': !isOfflineFriendsExtended, 'fa-minus': isOfflineFriendsExtended })} onClick={ toggleOfflineFriends }></i>
                <div className="align-self-center w-100 ml-2">Offline Friends (0)</div>
            </div>
        </div>
    );
}
