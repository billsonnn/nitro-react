import { FC, useCallback, useState } from 'react';
import { CreateEventDispatcherHook } from '../../../../hooks/events/event-dispatcher.base';
import { useRoomContext } from '../../context/RoomContext';
import { RoomWidgetRoomObjectUpdateEvent, RoomWidgetUpdateEvent, RoomWidgetUpdateInfostandEvent, RoomWidgetUpdateInfostandFurniEvent, RoomWidgetUpdateInfostandPetEvent, RoomWidgetUpdateInfostandRentableBotEvent, RoomWidgetUpdateInfostandUserEvent } from '../../events';
import { RoomWidgetRoomObjectMessage } from '../../messages';
import { InfoStandWidgetViewProps } from './InfoStandWidgetView.types';
import { InfoStandWidgetBotView } from './views/bot/InfoStandWidgetBotView';
import { InfoStandWidgetFurniView } from './views/furni/InfoStandWidgetFurniView';
import { InfoStandWidgetRentableBotView } from './views/rentable-bot/InfoStandWidgetRentableBotView';
import { InfoStandWidgetUserView } from './views/user/InfoStandWidgetUserView';

export const InfoStandWidgetView: FC<InfoStandWidgetViewProps> = props =>
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
            case RoomWidgetRoomObjectUpdateEvent.OBJECT_SELECTED: {
                const roomObjectEvent = (event as RoomWidgetRoomObjectUpdateEvent);

                widgetHandler.processWidgetMessage(new RoomWidgetRoomObjectMessage(RoomWidgetRoomObjectMessage.GET_OBJECT_INFO, roomObjectEvent.id, roomObjectEvent.category));
                return;
            }
            case RoomWidgetRoomObjectUpdateEvent.OBJECT_DESELECTED: {
                const roomObjectEvent = (event as RoomWidgetRoomObjectUpdateEvent);

                closeInfostand();
                return;
            }
            case RoomWidgetRoomObjectUpdateEvent.FURNI_REMOVED:
            case RoomWidgetRoomObjectUpdateEvent.USER_REMOVED: {
                const roomObjectEvent = (event as RoomWidgetRoomObjectUpdateEvent);

                setInfoStandEvent(prevValue =>
                    {
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
                                    if(prevValue.webID === roomObjectEvent.id) return null;
                                }

                                else if(prevValue instanceof RoomWidgetUpdateInfostandPetEvent)
                                {
                                    // room index
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
            case RoomWidgetUpdateInfostandRentableBotEvent.RENTABLE_BOT: {
                const infostandEvent = (event as RoomWidgetUpdateInfostandFurniEvent);

                setInfoStandEvent(infostandEvent);
                return;
            }
            default:
                console.log(event);
                return;
        }
    }, [ widgetHandler, closeInfostand ]);

    CreateEventDispatcherHook(RoomWidgetRoomObjectUpdateEvent.OBJECT_SELECTED, eventDispatcher, onRoomWidgetUpdateEvent);
    CreateEventDispatcherHook(RoomWidgetRoomObjectUpdateEvent.OBJECT_DESELECTED, eventDispatcher, onRoomWidgetUpdateEvent);
    CreateEventDispatcherHook(RoomWidgetRoomObjectUpdateEvent.USER_REMOVED, eventDispatcher, onRoomWidgetUpdateEvent);
    CreateEventDispatcherHook(RoomWidgetRoomObjectUpdateEvent.FURNI_REMOVED, eventDispatcher, onRoomWidgetUpdateEvent);
    CreateEventDispatcherHook(RoomWidgetUpdateInfostandFurniEvent.FURNI, eventDispatcher, onRoomWidgetUpdateEvent);
    CreateEventDispatcherHook(RoomWidgetUpdateInfostandUserEvent.OWN_USER, eventDispatcher, onRoomWidgetUpdateEvent);
    CreateEventDispatcherHook(RoomWidgetUpdateInfostandUserEvent.PEER, eventDispatcher, onRoomWidgetUpdateEvent);
    CreateEventDispatcherHook(RoomWidgetUpdateInfostandUserEvent.BOT, eventDispatcher, onRoomWidgetUpdateEvent);
    CreateEventDispatcherHook(RoomWidgetUpdateInfostandRentableBotEvent.RENTABLE_BOT, eventDispatcher, onRoomWidgetUpdateEvent);

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
