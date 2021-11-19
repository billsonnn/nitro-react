import { FC, useCallback, useState } from 'react';
import { RoomWidgetUpdateFriendRequestEvent } from '../../../../api';
import { CreateEventDispatcherHook } from '../../../../hooks';
import { useRoomContext } from '../../context/RoomContext';
import { FriendRequestDialogView } from './FriendRequestDialogView';

export const FriendRequestWidgetView: FC<{}> = props =>
{
    const [ friendRequests, setFriendRequests ] = useState<{ requestId: number, userId: number, userName: string }[]>([]);
    const { eventDispatcher = null } = useRoomContext();

    const showFriendRequest = useCallback((requestId: number, userId: number, userName: string) =>
    {
        const index = friendRequests.findIndex(value => (value.userId === userId));

        if(index >= 0) return;

        setFriendRequests(prevValue =>
            {
                const newValue = [ ...prevValue ];

                newValue.push({ requestId, userId, userName });

                return newValue;
            });
    }, [ friendRequests ]);

    const hideFriendRequest = useCallback((requestId: number) =>
    {
        const index = friendRequests.findIndex(value => (value.requestId === requestId));

        if(index === -1) return;

        setFriendRequests(prevValue =>
            {
                const newValue = [ ...prevValue ];

                newValue.splice(index, 1);

                return newValue;
            })
    }, [ friendRequests ]);

    const onRoomWidgetUpdateFriendRequestEvent = useCallback((event: RoomWidgetUpdateFriendRequestEvent) =>
    {
        switch(event.type)
        {
            case RoomWidgetUpdateFriendRequestEvent.SHOW_FRIEND_REQUEST:
                showFriendRequest(event.requestId, event.userId, event.userName);
                return;
            case RoomWidgetUpdateFriendRequestEvent.HIDE_FRIEND_REQUEST:
                hideFriendRequest(event.requestId);
                return;
        }
    }, [ showFriendRequest, hideFriendRequest ]);

    CreateEventDispatcherHook(RoomWidgetUpdateFriendRequestEvent.SHOW_FRIEND_REQUEST, eventDispatcher, onRoomWidgetUpdateFriendRequestEvent);
    CreateEventDispatcherHook(RoomWidgetUpdateFriendRequestEvent.HIDE_FRIEND_REQUEST, eventDispatcher, onRoomWidgetUpdateFriendRequestEvent);

    if(!friendRequests.length) return null;

    return (
        <>
            { friendRequests.map((request, index) =>
                {
                    return <FriendRequestDialogView key={ index } { ...request } close={ () => hideFriendRequest(request.userId) } />
                }) }
        </>
    );
}
