import { useEffect } from 'react';
import { RoomWidgetUpdateRoomObjectEvent, UI_EVENT_DISPATCHER } from '../../../api';

export const useUserAddedEvent = (isActive: boolean, handler: (event: RoomWidgetUpdateRoomObjectEvent) => void) =>
{
    useEffect(() =>
    {
        if(!isActive) return;

        const onRoomWidgetUpdateRoomObjectEvent = (event: RoomWidgetUpdateRoomObjectEvent) => handler(event);

        UI_EVENT_DISPATCHER.addEventListener(RoomWidgetUpdateRoomObjectEvent.USER_ADDED, onRoomWidgetUpdateRoomObjectEvent);

        return () =>
        {
            UI_EVENT_DISPATCHER.removeEventListener(RoomWidgetUpdateRoomObjectEvent.USER_ADDED, onRoomWidgetUpdateRoomObjectEvent);
        }
    }, [ isActive, handler ]);
}
