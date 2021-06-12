import { IFurnitureData, RoomObjectCategory, RoomObjectVariable } from 'nitro-renderer';
import { FC, useCallback } from 'react';
import { GetRoomEngine, GetRoomSession, GetSessionDataManager } from '../../../../api';
import { CreateEventDispatcherHook } from '../../../../hooks/events/event-dispatcher.base';
import { RoomObjectNameEvent, RoomWidgetRoomObjectUpdateEvent } from '../events';
import { AvatarInfoWidgetViewProps } from './AvatarInfoWidgetView.types';

export const AvatarInfoWidgetView: FC<AvatarInfoWidgetViewProps> = props =>
{
    const { events = null } = props;

    const processObjectName = useCallback((roomId: number, objectId: number, category: number) =>
    {
        let id = -1;
        let name: string = null;
        let type = 0;
        let roomIndex = 0;

        switch(category)
        {
            case RoomObjectCategory.FLOOR:
            case RoomObjectCategory.WALL:
                const roomObject = GetRoomEngine().getRoomObject(roomId, id, category);

                if(!roomObject) return;

                if(roomObject.type.indexOf('poster') === 0)
                {
                    name = ('${poster_' + parseInt(roomObject.type.replace('poster', '')) + '_name}');
                    roomIndex = roomObject.id;
                }
                else
                {
                    let furniData: IFurnitureData = null;

                    const typeId = roomObject.model.getValue<number>(RoomObjectVariable.FURNITURE_TYPE_ID);

                    if(category === RoomObjectCategory.FLOOR)
                    {
                        furniData = GetSessionDataManager().getFloorItemData(typeId);
                    }

                    else if(category === RoomObjectCategory.WALL)
                    {
                        furniData = GetSessionDataManager().getWallItemData(typeId);
                    }

                    if(!furniData) return;

                    id = furniData.id;
                    name = furniData.name;
                    roomIndex = roomObject.id;
                }
                break;
            case RoomObjectCategory.UNIT:
                const userData = GetRoomSession().userDataManager.getUserDataByIndex(id);

                if(!userData) return;

                id = userData.webID;
                name = userData.name;
                type = userData.type;
                roomIndex = userData.roomIndex;
                break;
        }

        if(!name) return;

        events.dispatchEvent(new RoomObjectNameEvent(id, category, name, type, roomIndex));
    }, [ events ]);

    const onRoomWidgetRoomObjectUpdateEvent = useCallback((event: RoomWidgetRoomObjectUpdateEvent) =>
    {
        switch(event.type)
        {
            case RoomWidgetRoomObjectUpdateEvent.OBJECT_ROLL_OVER: {
                processObjectName(event.roomId, event.id, event.category);
                return;
            }
            case RoomWidgetRoomObjectUpdateEvent.OBJECT_ROLL_OUT: {
                console.log('out');
                return;
            }
        }
    }, []);

    CreateEventDispatcherHook(RoomWidgetRoomObjectUpdateEvent.OBJECT_ROLL_OVER, events, onRoomWidgetRoomObjectUpdateEvent);
    CreateEventDispatcherHook(RoomWidgetRoomObjectUpdateEvent.OBJECT_ROLL_OUT, events, onRoomWidgetRoomObjectUpdateEvent);

    return null;
}
