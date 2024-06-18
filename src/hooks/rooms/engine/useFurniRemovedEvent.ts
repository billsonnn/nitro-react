import { useEffect } from 'react';
import { RoomWidgetUpdateRoomObjectEvent, UI_EVENT_DISPATCHER } from '../../../api';

export const useFurniRemovedEvent = (isActive: boolean, handler: (event: RoomWidgetUpdateRoomObjectEvent) => void) =>
{
    useEffect(() =>
    {
        if(!isActive) return;

        const onRoomWidgetUpdateRoomObjectEvent = (event: RoomWidgetUpdateRoomObjectEvent) => handler(event);

        UI_EVENT_DISPATCHER.addEventListener(RoomWidgetUpdateRoomObjectEvent.FURNI_REMOVED, onRoomWidgetUpdateRoomObjectEvent);

        return () =>
        {
            UI_EVENT_DISPATCHER.removeEventListener(RoomWidgetUpdateRoomObjectEvent.FURNI_REMOVED, onRoomWidgetUpdateRoomObjectEvent);
        };
    }, [ isActive, handler ]);
};
