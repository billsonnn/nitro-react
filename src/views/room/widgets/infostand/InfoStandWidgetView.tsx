import { FC, useCallback, useState } from 'react';
import { RoomWidgetRoomObjectMessage, RoomWidgetUpdateEvent, RoomWidgetUpdateInfostandEvent, RoomWidgetUpdateInfostandFurniEvent, RoomWidgetUpdateInfostandPetEvent, RoomWidgetUpdateInfostandRentableBotEvent, RoomWidgetUpdateInfostandUserEvent, RoomWidgetUpdateRoomObjectEvent } from '../../../../api';
import { CreateEventDispatcherHook } from '../../../../hooks/events/event-dispatcher.base';
import { useRoomContext } from '../../context/RoomContext';
import { InfoStandWidgetBotView } from './views/bot/InfoStandWidgetBotView';
import { InfoStandWidgetFurniView } from './views/furni/InfoStandWidgetFurniView';
import { InfoStandWidgetPetView } from './views/pet/InfoStandWidgetPetView';
import { InfoStandWidgetRentableBotView } from './views/rentable-bot/InfoStandWidgetRentableBotView';
import { InfoStandWidgetUserView } from './views/user/InfoStandWidgetUserView';

export const InfoStandWidgetView: FC<{}> = props =>
{
    const { eventDispatcher = null, widgetHandler = null } = useRoomContext();
    const [ infoStandEvent, setInfoStandEvent ] = useState<RoomWidgetUpdateInfostandEvent>(null);

    const closeInfostand = useCallback(() =>
    {
        setInfoStandEvent(null);
    }, []);

    const onRoomWidgetUpdateEvent = useCallback((event: RoomWidgetUpdateEvent) =>
    {
        switch(event.type)
        {
            case RoomWidgetUpdateRoomObjectEvent.OBJECT_SELECTED: {
                const roomObjectEvent = (event as RoomWidgetUpdateRoomObjectEvent);

                widgetHandler.processWidgetMessage(new RoomWidgetRoomObjectMessage(RoomWidgetRoomObjectMessage.GET_OBJECT_INFO, roomObjectEvent.id, roomObjectEvent.category));
                return;
            }
            case RoomWidgetUpdateRoomObjectEvent.OBJECT_DESELECTED: {
                const roomObjectEvent = (event as RoomWidgetUpdateRoomObjectEvent);

                closeInfostand();
                return;
            }
            case RoomWidgetUpdateRoomObjectEvent.FURNI_REMOVED:
            case RoomWidgetUpdateRoomObjectEvent.USER_REMOVED: {
                const roomObjectEvent = (event as RoomWidgetUpdateRoomObjectEvent);

                setInfoStandEvent(prevValue =>
                    {
                        switch(event.type)
                        {
                            case RoomWidgetUpdateRoomObjectEvent.FURNI_REMOVED:
                                if(prevValue instanceof RoomWidgetUpdateInfostandFurniEvent)
                                {
                                    if(prevValue.id === roomObjectEvent.id) return null;
                                }
                                break;
                            case RoomWidgetUpdateRoomObjectEvent.USER_REMOVED:
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
            case RoomWidgetUpdateInfostandFurniEvent.FURNI:
            case RoomWidgetUpdateInfostandUserEvent.OWN_USER:
            case RoomWidgetUpdateInfostandUserEvent.PEER:
            case RoomWidgetUpdateInfostandUserEvent.BOT:
            case RoomWidgetUpdateInfostandRentableBotEvent.RENTABLE_BOT:
            case RoomWidgetUpdateInfostandPetEvent.PET_INFO: {
                setInfoStandEvent((event as RoomWidgetUpdateInfostandEvent));
                return;
            }
            default:
                console.log(event);
                return;
        }
    }, [ widgetHandler, closeInfostand ]);

    CreateEventDispatcherHook(RoomWidgetUpdateRoomObjectEvent.OBJECT_SELECTED, eventDispatcher, onRoomWidgetUpdateEvent);
    CreateEventDispatcherHook(RoomWidgetUpdateRoomObjectEvent.OBJECT_DESELECTED, eventDispatcher, onRoomWidgetUpdateEvent);
    CreateEventDispatcherHook(RoomWidgetUpdateRoomObjectEvent.USER_REMOVED, eventDispatcher, onRoomWidgetUpdateEvent);
    CreateEventDispatcherHook(RoomWidgetUpdateRoomObjectEvent.FURNI_REMOVED, eventDispatcher, onRoomWidgetUpdateEvent);
    CreateEventDispatcherHook(RoomWidgetUpdateInfostandFurniEvent.FURNI, eventDispatcher, onRoomWidgetUpdateEvent);
    CreateEventDispatcherHook(RoomWidgetUpdateInfostandUserEvent.OWN_USER, eventDispatcher, onRoomWidgetUpdateEvent);
    CreateEventDispatcherHook(RoomWidgetUpdateInfostandUserEvent.PEER, eventDispatcher, onRoomWidgetUpdateEvent);
    CreateEventDispatcherHook(RoomWidgetUpdateInfostandUserEvent.BOT, eventDispatcher, onRoomWidgetUpdateEvent);
    CreateEventDispatcherHook(RoomWidgetUpdateInfostandRentableBotEvent.RENTABLE_BOT, eventDispatcher, onRoomWidgetUpdateEvent);
    CreateEventDispatcherHook(RoomWidgetUpdateInfostandPetEvent.PET_INFO, eventDispatcher, onRoomWidgetUpdateEvent);

    const getInfostandView = useCallback(() =>
    {
        if(!infoStandEvent) return null;

        switch(infoStandEvent.type)
        {
            case RoomWidgetUpdateInfostandFurniEvent.FURNI:
                return <InfoStandWidgetFurniView furniData={ (infoStandEvent as RoomWidgetUpdateInfostandFurniEvent) } close={ closeInfostand } />;
            case RoomWidgetUpdateInfostandUserEvent.OWN_USER:
            case RoomWidgetUpdateInfostandUserEvent.PEER:
                return <InfoStandWidgetUserView userData={ (infoStandEvent as RoomWidgetUpdateInfostandUserEvent) } close={ closeInfostand } />;
            case RoomWidgetUpdateInfostandUserEvent.BOT:
                return <InfoStandWidgetBotView botData={ (infoStandEvent as RoomWidgetUpdateInfostandUserEvent) } close={ closeInfostand } />;
            case RoomWidgetUpdateInfostandRentableBotEvent.RENTABLE_BOT:
                return <InfoStandWidgetRentableBotView rentableBotData={ (infoStandEvent as RoomWidgetUpdateInfostandRentableBotEvent) } close={ closeInfostand } />;
            case RoomWidgetUpdateInfostandPetEvent.PET_INFO:
                return <InfoStandWidgetPetView petData={ (infoStandEvent as RoomWidgetUpdateInfostandPetEvent) } close={ closeInfostand } />
        }

        return null;
    }, [ infoStandEvent, closeInfostand ]);

    if(!infoStandEvent) return null;

    return (
        <div className="d-flex flex-column align-items-end nitro-infostand-container">
            { getInfostandView() }
        </div>
    );
}
