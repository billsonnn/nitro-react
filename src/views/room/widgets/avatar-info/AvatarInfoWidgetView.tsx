import { RoomObjectCategory } from 'nitro-renderer';
import { FC, useCallback, useState } from 'react';
import { CreateEventDispatcherHook } from '../../../../hooks/events/event-dispatcher.base';
import { useRoomContext } from '../../context/RoomContext';
import { RoomWidgetObjectNameEvent, RoomWidgetRoomEngineUpdateEvent, RoomWidgetRoomObjectUpdateEvent, RoomWidgetUpdateEvent, RoomWidgetUpdateInfostandEvent, RoomWidgetUpdateInfostandFurniEvent, RoomWidgetUpdateInfostandPetEvent, RoomWidgetUpdateInfostandRentableBotEvent, RoomWidgetUpdateInfostandUserEvent } from '../../events';
import { RoomWidgetRoomObjectMessage } from '../../messages';
import { AvatarInfoWidgetViewProps } from './AvatarInfoWidgetView.types';
import { AvatarInfoWidgetNameView } from './views/name/AvatarInfoWidgetNameView';

export const AvatarInfoWidgetView: FC<AvatarInfoWidgetViewProps> = props =>
{
    const { eventDispatcher = null, widgetHandler = null } = useRoomContext();
    const [ name, setName ] = useState<RoomWidgetObjectNameEvent>(null);
    const [ infoStandEvent, setInfoStandEvent ] = useState<RoomWidgetUpdateInfostandEvent>(null);
    const [ isGameMode, setGameMode ] = useState(false);

    const onRoomWidgetUpdateEvent = useCallback((event: RoomWidgetUpdateEvent) =>
    {
        switch(event.type)
        {
            case RoomWidgetRoomEngineUpdateEvent.NORMAL_MODE: {
                const roomEngineEvent = (event as RoomWidgetRoomEngineUpdateEvent);

                setGameMode(false);
                return;
            }
            case RoomWidgetRoomEngineUpdateEvent.GAME_MODE: {
                const roomEngineEvent = (event as RoomWidgetRoomEngineUpdateEvent);

                setGameMode(true);
                return;
            }
            case RoomWidgetRoomObjectUpdateEvent.USER_ADDED: {
                const roomObjectEvent = (event as RoomWidgetRoomObjectUpdateEvent);

                return;
            }
            case RoomWidgetRoomObjectUpdateEvent.FURNI_REMOVED:
            case RoomWidgetRoomObjectUpdateEvent.USER_REMOVED: {
                const roomObjectEvent = (event as RoomWidgetRoomObjectUpdateEvent);

                setName(prevValue =>
                    {
                        if(!prevValue || (roomObjectEvent.id === prevValue.id)) return null;

                        return prevValue;
                    })

                setInfoStandEvent(prevValue =>
                    {
                        if(!prevValue) return null;

                        switch(event.type)
                        {
                            case RoomWidgetRoomObjectUpdateEvent.FURNI_REMOVED:
                                if(prevValue instanceof RoomWidgetUpdateInfostandFurniEvent)
                                {
                                    if(prevValue.id === roomObjectEvent.id) return null;
                                }
                                break;
                            case RoomWidgetRoomObjectUpdateEvent.USER_REMOVED:
                                if(prevValue instanceof RoomWidgetUpdateInfostandUserEvent || prevValue instanceof RoomWidgetUpdateInfostandRentableBotEvent)
                                {
                                    if(prevValue.roomIndex === roomObjectEvent.id) return null;
                                }

                                else if(prevValue instanceof RoomWidgetUpdateInfostandPetEvent)
                                {
                                    if(prevValue.roomIndex === roomObjectEvent.id) return null;
                                }
                                break;
                        }

                        return prevValue;
                    });

                return;
            }
            case RoomWidgetRoomObjectUpdateEvent.OBJECT_ROLL_OVER: {
                const roomObjectEvent = (event as RoomWidgetRoomObjectUpdateEvent);
                
                widgetHandler.processWidgetMessage(new RoomWidgetRoomObjectMessage(RoomWidgetRoomObjectMessage.GET_OBJECT_NAME, roomObjectEvent.id, roomObjectEvent.category));
                return;
            }
            case RoomWidgetRoomObjectUpdateEvent.OBJECT_ROLL_OUT: {
                const roomObjectEvent = (event as RoomWidgetRoomObjectUpdateEvent);

                setName(null);
                return;
            }
            case RoomWidgetObjectNameEvent.TYPE: {
                const objectNameEvent = (event as RoomWidgetObjectNameEvent);

                if(objectNameEvent.category !== RoomObjectCategory.UNIT) return;

                setName(objectNameEvent);

                return;
            }
            case RoomWidgetUpdateInfostandFurniEvent.FURNI:
            case RoomWidgetUpdateInfostandUserEvent.OWN_USER:
            case RoomWidgetUpdateInfostandUserEvent.PEER:
            case RoomWidgetUpdateInfostandUserEvent.BOT:
            case RoomWidgetUpdateInfostandRentableBotEvent.RENTABLE_BOT: {
                setInfoStandEvent((event as RoomWidgetUpdateInfostandFurniEvent));
                return;
            }
            default:
                console.log(event);
                return;
        }
    }, [ widgetHandler ]);

    CreateEventDispatcherHook(RoomWidgetRoomEngineUpdateEvent.NORMAL_MODE, eventDispatcher, onRoomWidgetUpdateEvent);
    CreateEventDispatcherHook(RoomWidgetRoomEngineUpdateEvent.GAME_MODE, eventDispatcher, onRoomWidgetUpdateEvent);
    CreateEventDispatcherHook(RoomWidgetRoomObjectUpdateEvent.USER_ADDED, eventDispatcher, onRoomWidgetUpdateEvent);
    CreateEventDispatcherHook(RoomWidgetRoomObjectUpdateEvent.USER_REMOVED, eventDispatcher, onRoomWidgetUpdateEvent);
    CreateEventDispatcherHook(RoomWidgetRoomObjectUpdateEvent.FURNI_REMOVED, eventDispatcher, onRoomWidgetUpdateEvent);
    CreateEventDispatcherHook(RoomWidgetRoomObjectUpdateEvent.OBJECT_ROLL_OVER, eventDispatcher, onRoomWidgetUpdateEvent);
    CreateEventDispatcherHook(RoomWidgetRoomObjectUpdateEvent.OBJECT_ROLL_OUT, eventDispatcher, onRoomWidgetUpdateEvent);
    CreateEventDispatcherHook(RoomWidgetObjectNameEvent.TYPE, eventDispatcher, onRoomWidgetUpdateEvent);
    CreateEventDispatcherHook(RoomWidgetUpdateInfostandFurniEvent.FURNI, eventDispatcher, onRoomWidgetUpdateEvent);
    CreateEventDispatcherHook(RoomWidgetUpdateInfostandUserEvent.OWN_USER, eventDispatcher, onRoomWidgetUpdateEvent);
    CreateEventDispatcherHook(RoomWidgetUpdateInfostandUserEvent.PEER, eventDispatcher, onRoomWidgetUpdateEvent);
    CreateEventDispatcherHook(RoomWidgetUpdateInfostandUserEvent.BOT, eventDispatcher, onRoomWidgetUpdateEvent);
    CreateEventDispatcherHook(RoomWidgetUpdateInfostandRentableBotEvent.RENTABLE_BOT, eventDispatcher, onRoomWidgetUpdateEvent);

    return (
        <>
            { name && <AvatarInfoWidgetNameView event={ name } /> }
        </>
    )
}
