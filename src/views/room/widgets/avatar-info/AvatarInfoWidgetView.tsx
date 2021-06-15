import { RoomObjectCategory } from 'nitro-renderer';
import { FC, useCallback, useState } from 'react';
import { GetObjectName, RoomObjectNameData } from '../../../../api';
import { CreateEventDispatcherHook } from '../../../../hooks/events/event-dispatcher.base';
import { RoomWidgetRoomEngineUpdateEvent, RoomWidgetRoomObjectUpdateEvent } from '../events';
import { AvatarInfoWidgetViewProps } from './AvatarInfoWidgetView.types';
import { AvatarInfoWidgetNameView } from './views/name/AvatarInfoWidgetNameView';

export const AvatarInfoWidgetView: FC<AvatarInfoWidgetViewProps> = props =>
{
    const { events = null } = props;
    const [ names, setNames ] = useState<RoomObjectNameData[]>([]);
    const [ isGameMode, setGameMode ] = useState(false);

    const onRoomWidgetRoomObjectUpdateEvent = useCallback((event: RoomWidgetRoomObjectUpdateEvent) =>
    {
        switch(event.type)
        {
            case RoomWidgetRoomObjectUpdateEvent.OBJECT_ROLL_OVER: {
                if(isGameMode) return;

                if(event.category !== RoomObjectCategory.UNIT) return;

                const nameData = GetObjectName(event.roomId, event.id, event.category);

                if(nameData)
                {
                    setNames(prevValue =>
                        {
                            const existing = prevValue.filter(value =>
                                {
                                    if(value.objectId === nameData.id) return null;
            
                                    return value;
                                });
            
                            return [ ...existing, new RoomObjectNameData(nameData.objectId, nameData.category, nameData.id, nameData.name, nameData.type) ]
                        });
                }
                return;
            }
            case RoomWidgetRoomObjectUpdateEvent.OBJECT_ROLL_OUT: {
                if(isGameMode) return;
                
                setNames(prevValue =>
                    {
                        return prevValue.filter(value =>
                            {
                                if(value.objectId === event.id) return null;

                                return value;
                            });
                    });
                return;
            }
        }
    }, [ isGameMode ]);

    const onRoomWidgetRoomEngineUpdateEvent = useCallback((event: RoomWidgetRoomEngineUpdateEvent) =>
    {
        switch(event.type)
        {
            case RoomWidgetRoomEngineUpdateEvent.RWREUE_NORMAL_MODE:
                setGameMode(false);
                break;
            case RoomWidgetRoomEngineUpdateEvent.RWREUE_GAME_MODE:
                setGameMode(true);
                break;
        }
    }, []);

    CreateEventDispatcherHook(RoomWidgetRoomObjectUpdateEvent.OBJECT_ROLL_OVER, events, onRoomWidgetRoomObjectUpdateEvent);
    CreateEventDispatcherHook(RoomWidgetRoomObjectUpdateEvent.OBJECT_ROLL_OUT, events, onRoomWidgetRoomObjectUpdateEvent);

    CreateEventDispatcherHook(RoomWidgetRoomEngineUpdateEvent.RWREUE_NORMAL_MODE, events, onRoomWidgetRoomEngineUpdateEvent);
    CreateEventDispatcherHook(RoomWidgetRoomEngineUpdateEvent.RWREUE_GAME_MODE, events, onRoomWidgetRoomEngineUpdateEvent);

    return (
        <>
            { names && (names.length > 0) && names.map((data, index) =>
                {
                    return <AvatarInfoWidgetNameView key={ index } nameData={ data } />
                }) }
        </>
    )
}
