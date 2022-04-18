import { RoomObjectCategory, RoomObjectVariable } from '@nitrots/nitro-renderer';
import { useCallback, useEffect, useState } from 'react';
import { GetRoomEngine, GetRoomSession, GetSessionDataManager, LocalizeText, RoomObjectItem, RoomWidgetUpdateRoomObjectEvent } from '../../../api';
import { UI_EVENT_DISPATCHER } from '../../events';

const useFurniChooserWidgetState = () =>
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
        const sessionDataManager = GetSessionDataManager();
        const wallObjects = GetRoomEngine().getRoomObjects(roomSession.roomId, RoomObjectCategory.WALL);
        const floorObjects = GetRoomEngine().getRoomObjects(roomSession.roomId, RoomObjectCategory.FLOOR);

        const wallItems = wallObjects.map(roomObject =>
        {
            if(roomObject.id < 0) return null;

            let name = roomObject.type;

            if(name.startsWith('poster'))
            {
                name = LocalizeText(`poster_${ name.replace('poster', '') }_name`);
            }
            else
            {
                const typeId = roomObject.model.getValue<number>(RoomObjectVariable.FURNITURE_TYPE_ID);
                const furniData = sessionDataManager.getWallItemData(typeId);

                if(furniData && furniData.name.length) name = furniData.name;
            }

            return new RoomObjectItem(roomObject.id, RoomObjectCategory.WALL, name);
        });

        const floorItems = floorObjects.map(roomObject =>
        {
            if(roomObject.id < 0) return null;

            let name = roomObject.type;

            const typeId = roomObject.model.getValue<number>(RoomObjectVariable.FURNITURE_TYPE_ID);
            const furniData = sessionDataManager.getFloorItemData(typeId);

            if(furniData && furniData.name.length) name = furniData.name;

            return new RoomObjectItem(roomObject.id, RoomObjectCategory.FLOOR, name);
        });

        setItems([ ...wallItems, ...floorItems ].sort((a, b) => ((a.name < b.name) ? -1 : 1)));
    }, []);

    useEffect(() =>
    {
        if(!items) return;

        const onRoomWidgetUpdateRoomObjectEvent = (event: RoomWidgetUpdateRoomObjectEvent) =>
        {
            if(event.id < 0) return;

            const roomObject = GetRoomEngine().getRoomObject(GetRoomSession().roomId, event.id, event.category);

            if(!roomObject) return;

            let item: RoomObjectItem = null;

            switch(event.category)
            {
                case RoomObjectCategory.WALL: {
                    let name = roomObject.type;

                    if(name.startsWith('poster'))
                    {
                        name = LocalizeText(`poster_${ name.replace('poster', '') }_name`);
                    }
                    else
                    {
                        const typeId = roomObject.model.getValue<number>(RoomObjectVariable.FURNITURE_TYPE_ID);
                        const furniData = GetSessionDataManager().getWallItemData(typeId);

                        if(furniData && furniData.name.length) name = furniData.name;
                    }

                    item = new RoomObjectItem(roomObject.id, RoomObjectCategory.WALL, name);

                    break;
                }
                case RoomObjectCategory.FLOOR: {
                    let name = roomObject.type;

                    const typeId = roomObject.model.getValue<number>(RoomObjectVariable.FURNITURE_TYPE_ID);
                    const furniData = GetSessionDataManager().getFloorItemData(typeId);

                    if(furniData && furniData.name.length) name = furniData.name;

                    item = new RoomObjectItem(roomObject.id, RoomObjectCategory.FLOOR, name);
                }
            }

            setItems(prevValue => [ ...prevValue, item ].sort((a, b) => ((a.name < b.name) ? -1 : 1)));
        }

        UI_EVENT_DISPATCHER.addEventListener(RoomWidgetUpdateRoomObjectEvent.FURNI_ADDED, onRoomWidgetUpdateRoomObjectEvent);

        return () =>
        {
            UI_EVENT_DISPATCHER.removeEventListener(RoomWidgetUpdateRoomObjectEvent.FURNI_ADDED, onRoomWidgetUpdateRoomObjectEvent);
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

        UI_EVENT_DISPATCHER.addEventListener(RoomWidgetUpdateRoomObjectEvent.FURNI_REMOVED, onRoomWidgetUpdateRoomObjectEvent);

        return () =>
        {
            UI_EVENT_DISPATCHER.removeEventListener(RoomWidgetUpdateRoomObjectEvent.FURNI_REMOVED, onRoomWidgetUpdateRoomObjectEvent);
        }
    }, [ items ]);

    return { items, close, selectItem, populateChooser };
}

export const useFurniChooserWidget = useFurniChooserWidgetState;
