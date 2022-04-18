import { RoomObjectCategory, RoomObjectUserType } from '@nitrots/nitro-renderer';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { GetRoomSession, MessengerRequest, RoomWidgetUpdateRoomObjectEvent } from '../../../api';
import { UseUiEvent } from '../../events';
import { useFriends } from '../../friends';

const useFriendRequestWidgetState = () =>
{
    const [ activeRequests, setActiveRequests ] = useState<{ roomIndex: number, request: MessengerRequest }[]>([]);
    const [ dismissedRequestIds, setDismissedRequestIds ] = useState<number[]>([]);
    const { requests = [] } = useFriends();

    const displayedRequests = useMemo(() => activeRequests.filter(request => (dismissedRequestIds.indexOf(request.request.requesterUserId) === -1)), [ activeRequests, dismissedRequestIds ]);

    const hideFriendRequest = (userId: number) =>
    {
        setDismissedRequestIds(prevValue =>
        {
            if(prevValue.indexOf(userId) >= 0) return prevValue;

            const newValue = [ ...prevValue ];

            newValue.push(userId);

            return newValue;
        });
    }

    const onRoomWidgetUpdateRoomObjectEvent = useCallback((event: RoomWidgetUpdateRoomObjectEvent) =>
    {
        if(event.category !== RoomObjectCategory.UNIT) return;
        
        const userData = GetRoomSession().userDataManager.getUserDataByIndex(event.id);

        if(userData && (userData.type === RoomObjectUserType.getTypeNumber(RoomObjectUserType.USER)))
        {
            if(event.type === RoomWidgetUpdateRoomObjectEvent.USER_ADDED)
            {
                const request = requests.find(request => (request.requesterUserId === userData.webID));

                if(!request || activeRequests.find(request => (request.request.requesterUserId === userData.webID))) return;

                const newValue = [ ...activeRequests ];

                newValue.push({ roomIndex: userData.roomIndex, request });

                setActiveRequests(newValue);
            }

            return;
        }

        if(event.type === RoomWidgetUpdateRoomObjectEvent.USER_REMOVED)
        {
            const index = activeRequests.findIndex(request => (request.roomIndex === event.id));

            if(index === -1) return;

            const newValue = [ ...activeRequests ];

            newValue.splice(index, 1);

            setActiveRequests(newValue);
        }
    }, [ requests, activeRequests ]);

    UseUiEvent(RoomWidgetUpdateRoomObjectEvent.USER_ADDED, onRoomWidgetUpdateRoomObjectEvent);
    UseUiEvent(RoomWidgetUpdateRoomObjectEvent.USER_REMOVED, onRoomWidgetUpdateRoomObjectEvent);

    useEffect(() =>
    {
        if(!requests || !requests.length) return;

        const newDisplayedRequests: { roomIndex: number, request: MessengerRequest }[] = [];

        for(const request of requests)
        {
            const userData = GetRoomSession().userDataManager.getUserData(request.requesterUserId);

            if(!userData) continue;

            newDisplayedRequests.push({ roomIndex: userData.roomIndex, request });
        }

        setActiveRequests(newDisplayedRequests);
    }, [ requests ]);

    return { displayedRequests, hideFriendRequest };
}

export const useFriendRequestWidget = useFriendRequestWidgetState;
