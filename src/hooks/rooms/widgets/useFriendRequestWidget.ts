import { RoomObjectCategory, RoomObjectUserType } from '@nitrots/nitro-renderer';
import { useEffect, useMemo, useState } from 'react';
import { GetRoomSession, MessengerRequest } from '../../../api';
import { useFriends } from '../../friends';
import { useUserAddedEvent, useUserRemovedEvent } from '../engine';

const useFriendRequestWidgetState = () =>
{
    const [ activeRequests, setActiveRequests ] = useState<{ roomIndex: number, request: MessengerRequest }[]>([]);
    const { requests = [], dismissedRequestIds = [], setDismissedRequestIds = null } = useFriends();

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
    };

    useUserAddedEvent(true, event =>
    {
        if(event.category !== RoomObjectCategory.UNIT) return;

        const userData = GetRoomSession().userDataManager.getUserDataByIndex(event.id);

        if(!userData || (userData.type !== RoomObjectUserType.getTypeNumber(RoomObjectUserType.USER))) return;

        const request = requests.find(request => (request.requesterUserId === userData.webID));

        if(!request || activeRequests.find(request => (request.request.requesterUserId === userData.webID))) return;

        const newValue = [ ...activeRequests ];

        newValue.push({ roomIndex: userData.roomIndex, request });

        setActiveRequests(newValue);
    });

    useUserRemovedEvent(true, event =>
    {
        if(event.category !== RoomObjectCategory.UNIT) return;

        const index = activeRequests.findIndex(request => (request.roomIndex === event.id));

        if(index === -1) return;

        const newValue = [ ...activeRequests ];

        newValue.splice(index, 1);

        setActiveRequests(newValue);
    });

    useEffect(() =>
    {
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
};

export const useFriendRequestWidget = useFriendRequestWidgetState;
