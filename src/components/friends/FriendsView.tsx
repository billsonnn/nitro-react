import { FC } from 'react';
import { createPortal } from 'react-dom';
import { useFriends } from '../../hooks';
import { FriendBarView } from './views/friends-bar/FriendsBarView';
import { FriendsListView } from './views/friends-list/FriendsListView';
import { FriendsMessengerView } from './views/messenger/FriendsMessengerView';

export const FriendsView: FC<{}> = props =>
{
    const { settings = null, onlineFriends = [] } = useFriends();

    // const onRoomEngineObjectEvent = useCallback((event: RoomEngineObjectEvent) =>
    // {
    //     const roomSession = GetRoomSession();

    //     if(!roomSession) return;

    //     if(event.category !== RoomObjectCategory.UNIT) return;
        
    //     const userData = roomSession.userDataManager.getUserDataByIndex(event.objectId);

    //     if(!userData || (userData.type !== RoomObjectUserType.getTypeNumber(RoomObjectUserType.USER))) return;

    //     const friend = getFriend(userData.webID);

    //     if(!friend) return;

    //     DispatchUiEvent(new FriendEnteredRoomEvent(userData.roomIndex, RoomObjectCategory.UNIT, userData.webID, userData.name, userData.type));
    // }, [ getFriend ]);

    // UseRoomEngineEvent(RoomEngineObjectEvent.ADDED, onRoomEngineObjectEvent);

    if(!settings) return null;

    return (
        <>
            { createPortal(<FriendBarView onlineFriends={ onlineFriends } />, document.getElementById('toolbar-friend-bar-container')) }
            <FriendsListView />
            <FriendsMessengerView />
        </>
    );
}
