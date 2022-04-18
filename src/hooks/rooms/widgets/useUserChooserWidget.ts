import { RoomObjectCategory } from '@nitrots/nitro-renderer';
import { useCallback, useEffect, useState } from 'react';
import { GetRoomEngine, GetRoomSession, RoomObjectItem, RoomWidgetUpdateRoomObjectEvent } from '../../../api';
import { UI_EVENT_DISPATCHER } from '../../events';

const useUserChooserWidgetState = () =>
{
    const [ items, setItems ] = useState<RoomObjectItem[]>(null);

    const close = () =>
    {
        setItems(null);
    }

    const selectItem = (item: RoomObjectItem) =>
    {
        if(!item) return;

        GetRoomEngine().selectRoomObject(GetRoomSession().roomId, item.id, item.category);
    }

    const populateChooser = useCallback(() =>
    {
        const roomSession = GetRoomSession();
        const roomObjects = GetRoomEngine().getRoomObjects(roomSession.roomId, RoomObjectCategory.UNIT);

        const newItems = roomObjects
            .map(roomObject =>
            {
                if(roomObject.id < 0) return null;
                
                const userData = roomSession.userDataManager.getUserDataByIndex(roomObject.id);

                if(!userData) return null;

                return new RoomObjectItem(userData.roomIndex, RoomObjectCategory.UNIT, userData.name);
            })
            .sort((a, b) => ((a.name < b.name) ? -1 : 1));

        setItems(newItems);
    }, []);

    useEffect(() =>
    {
        if(!items) return;

        const onRoomWidgetUpdateRoomObjectEvent = (event: RoomWidgetUpdateRoomObjectEvent) =>
        {
            if(event.id < 0) return;

            const userData = GetRoomSession().userDataManager.getUserDataByIndex(event.id);

            if(!userData) return;

            setItems(prevValue =>
            {
                const newValue = [ ...prevValue ];

                newValue.push(new RoomObjectItem(userData.roomIndex, RoomObjectCategory.UNIT, userData.name));
                newValue.sort((a, b) => ((a.name < b.name) ? -1 : 1));

                return newValue;
            });
        }

        UI_EVENT_DISPATCHER.addEventListener(RoomWidgetUpdateRoomObjectEvent.USER_ADDED, onRoomWidgetUpdateRoomObjectEvent);

        return () =>
        {
            UI_EVENT_DISPATCHER.removeEventListener(RoomWidgetUpdateRoomObjectEvent.USER_ADDED, onRoomWidgetUpdateRoomObjectEvent);
        }
    }, [ items ]);

    useEffect(() =>
    {
        if(!items) return;

        const onRoomWidgetUpdateRoomObjectEvent = (event: RoomWidgetUpdateRoomObjectEvent) =>
        {
            if(event.id < 0) return;

            setItems(prevValue =>
            {
                const newValue = [ ...prevValue ];

                for(let i = 0; i < newValue.length; i++)
                {
                    const existingValue = newValue[i];

                    if((existingValue.id !== event.id) || (existingValue.category !== event.category)) continue;

                    newValue.splice(i, 1);

                    break;
                }

                return newValue;
            });
        }

        UI_EVENT_DISPATCHER.addEventListener(RoomWidgetUpdateRoomObjectEvent.USER_REMOVED, onRoomWidgetUpdateRoomObjectEvent);

        return () =>
        {
            UI_EVENT_DISPATCHER.removeEventListener(RoomWidgetUpdateRoomObjectEvent.USER_REMOVED, onRoomWidgetUpdateRoomObjectEvent);
        }
    }, [ items ]);

    return { items, close, selectItem, populateChooser };
}

export const useUserChooserWidget = useUserChooserWidgetState;
