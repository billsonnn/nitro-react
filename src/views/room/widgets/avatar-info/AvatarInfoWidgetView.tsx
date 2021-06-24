import { RoomEnterEffect, RoomObjectCategory } from 'nitro-renderer';
import { FC, useCallback, useMemo, useState } from 'react';
import { GetRoomSession, GetSessionDataManager } from '../../../../api';
import { CreateEventDispatcherHook } from '../../../../hooks/events/event-dispatcher.base';
import { useRoomContext } from '../../context/RoomContext';
import { RoomWidgetObjectNameEvent, RoomWidgetRoomEngineUpdateEvent, RoomWidgetRoomObjectUpdateEvent, RoomWidgetUpdateDanceStatusEvent, RoomWidgetUpdateInfostandEvent, RoomWidgetUpdateInfostandFurniEvent, RoomWidgetUpdateInfostandPetEvent, RoomWidgetUpdateInfostandRentableBotEvent, RoomWidgetUpdateInfostandUserEvent } from '../../events';
import { RoomWidgetRoomObjectMessage } from '../../messages';
import { AvatarInfoWidgetViewProps } from './AvatarInfoWidgetView.types';
import { AvatarInfoWidgetAvatarView } from './views/avatar/AvatarInfoWidgetAvatarView';
import { AvatarInfoWidgetDecorateView } from './views/decorate/AvatarInfoWidgetDecorateView';
import { AvatarInfoWidgetNameView } from './views/name/AvatarInfoWidgetNameView';
import { AvatarInfoWidgetOwnAvatarView } from './views/own-avatar/AvatarInfoWidgetOwnAvatarView';
import { AvatarInfoWidgetOwnPetView } from './views/own-pet/AvatarInfoWidgetOwnPetView';
import { AvatarInfoWidgetPetView } from './views/pet/AvatarInfoWidgetPetView';
import { AvatarInfoWidgetRentableBotView } from './views/rentable-bot/AvatarInfoWidgetRentableBotView';

export const AvatarInfoWidgetView: FC<AvatarInfoWidgetViewProps> = props =>
{
    const { eventDispatcher = null, widgetHandler = null } = useRoomContext();
    const [ name, setName ] = useState<RoomWidgetObjectNameEvent>(null);
    const [ infoStandEvent, setInfoStandEvent ] = useState<RoomWidgetUpdateInfostandEvent>(null);
    const [ isGameMode, setGameMode ] = useState(false);
    const [ isDancing, setIsDancing ] = useState(false);
    const [ isDecorating, setIsDecorating ] = useState(GetRoomSession().isDecorating);

    const onRoomWidgetRoomEngineUpdateEvent = useCallback((event: RoomWidgetRoomEngineUpdateEvent) =>
    {
        switch(event.type)
        {
            case RoomWidgetRoomEngineUpdateEvent.NORMAL_MODE: {
                if(isGameMode) setGameMode(false);
                return;
            }
            case RoomWidgetRoomEngineUpdateEvent.GAME_MODE: {
                if(!isGameMode) setGameMode(true);
                return;
            }
        }
    }, [ isGameMode ]);

    CreateEventDispatcherHook(RoomWidgetRoomEngineUpdateEvent.NORMAL_MODE, eventDispatcher, onRoomWidgetRoomEngineUpdateEvent);
    CreateEventDispatcherHook(RoomWidgetRoomEngineUpdateEvent.GAME_MODE, eventDispatcher, onRoomWidgetRoomEngineUpdateEvent);

    const onRoomObjectRemoved = useCallback((event: RoomWidgetRoomObjectUpdateEvent) =>
    {
        if(name)
        {
            if(event.id === name.id) setName(null);
        }

        if(infoStandEvent)
        {
            if(infoStandEvent instanceof RoomWidgetUpdateInfostandFurniEvent)
            {
                if(infoStandEvent.id === event.id) setInfoStandEvent(null);
            }

            else if((infoStandEvent instanceof RoomWidgetUpdateInfostandUserEvent) || (infoStandEvent instanceof RoomWidgetUpdateInfostandRentableBotEvent))
            {
                if(infoStandEvent.roomIndex === event.id) setInfoStandEvent(null);
            }

            else if(infoStandEvent instanceof RoomWidgetUpdateInfostandPetEvent)
            {
                if(infoStandEvent.roomIndex === event.id) setInfoStandEvent(null);
            }
        }
    }, [ name, infoStandEvent ]);

    CreateEventDispatcherHook(RoomWidgetRoomObjectUpdateEvent.USER_REMOVED, eventDispatcher, onRoomObjectRemoved);
    CreateEventDispatcherHook(RoomWidgetRoomObjectUpdateEvent.FURNI_REMOVED, eventDispatcher, onRoomObjectRemoved);

    const onObjectRolled = useCallback((event: RoomWidgetRoomObjectUpdateEvent) =>
    {
        switch(event.type)
        {
            case RoomWidgetRoomObjectUpdateEvent.OBJECT_ROLL_OVER: {
                const roomObjectEvent = (event as RoomWidgetRoomObjectUpdateEvent);

                if(infoStandEvent) return;

                widgetHandler.processWidgetMessage(new RoomWidgetRoomObjectMessage(RoomWidgetRoomObjectMessage.GET_OBJECT_NAME, roomObjectEvent.id, roomObjectEvent.category));

                return;
            }
            case RoomWidgetRoomObjectUpdateEvent.OBJECT_ROLL_OUT: {
                const roomObjectEvent = (event as RoomWidgetRoomObjectUpdateEvent);

                if(!name || (name.roomIndex !== roomObjectEvent.id)) return;

                setName(null);

                return;
            }
        }
    }, [ infoStandEvent, name, widgetHandler ]);

    CreateEventDispatcherHook(RoomWidgetRoomObjectUpdateEvent.OBJECT_ROLL_OVER, eventDispatcher, onObjectRolled);
    CreateEventDispatcherHook(RoomWidgetRoomObjectUpdateEvent.OBJECT_ROLL_OUT, eventDispatcher, onObjectRolled);

    const onObjectDeselected = useCallback((event: RoomWidgetRoomObjectUpdateEvent) =>
    {
        if(!infoStandEvent) return;

        setInfoStandEvent(null);
    }, [ infoStandEvent ]);

    CreateEventDispatcherHook(RoomWidgetRoomObjectUpdateEvent.OBJECT_DESELECTED, eventDispatcher, onObjectDeselected);

    const onRoomWidgetObjectNameEvent = useCallback((event: RoomWidgetObjectNameEvent) =>
    {
        if(event.category !== RoomObjectCategory.UNIT) return;

        setName(event);
    }, []);

    CreateEventDispatcherHook(RoomWidgetObjectNameEvent.TYPE, eventDispatcher, onRoomWidgetObjectNameEvent);

    const onRoomWidgetUpdateInfostandEvent = useCallback((event: RoomWidgetUpdateInfostandEvent) =>
    {
        if(name) setName(null);
        setInfoStandEvent(event);
    }, [ name ]);

    CreateEventDispatcherHook(RoomWidgetUpdateInfostandFurniEvent.FURNI, eventDispatcher, onRoomWidgetUpdateInfostandEvent);
    CreateEventDispatcherHook(RoomWidgetUpdateInfostandUserEvent.OWN_USER, eventDispatcher, onRoomWidgetUpdateInfostandEvent);
    CreateEventDispatcherHook(RoomWidgetUpdateInfostandUserEvent.PEER, eventDispatcher, onRoomWidgetUpdateInfostandEvent);
    CreateEventDispatcherHook(RoomWidgetUpdateInfostandUserEvent.BOT, eventDispatcher, onRoomWidgetUpdateInfostandEvent);
    CreateEventDispatcherHook(RoomWidgetUpdateInfostandRentableBotEvent.RENTABLE_BOT, eventDispatcher, onRoomWidgetUpdateInfostandEvent);
    CreateEventDispatcherHook(RoomWidgetUpdateInfostandPetEvent.PET_INFO, eventDispatcher, onRoomWidgetUpdateInfostandEvent);

    const onRoomWidgetUpdateDanceStatusEvent = useCallback((event: RoomWidgetUpdateDanceStatusEvent) =>
    {
        setIsDancing(event.isDancing);
    }, []);

    CreateEventDispatcherHook(RoomWidgetUpdateDanceStatusEvent.UPDATE_DANCE, eventDispatcher, onRoomWidgetUpdateDanceStatusEvent);

    const onRoomWidgetRoomObjectUpdateEvent = useCallback((event: RoomWidgetRoomObjectUpdateEvent) =>
    {
        switch(event.type)
        {
            case RoomWidgetRoomObjectUpdateEvent.USER_ADDED: {
                // bubble if friend

                return;
            }
            case RoomWidgetRoomObjectUpdateEvent.OBJECT_SELECTED: {
                // set if waiting for pet

                return;
            }
        }
    }, []);

    CreateEventDispatcherHook(RoomWidgetRoomObjectUpdateEvent.USER_ADDED, eventDispatcher, onRoomWidgetRoomObjectUpdateEvent);
    CreateEventDispatcherHook(RoomWidgetRoomObjectUpdateEvent.OBJECT_SELECTED, eventDispatcher, onRoomWidgetRoomObjectUpdateEvent);

    const decorateView = useMemo(() =>
    {
        GetRoomSession().isDecorating = isDecorating;

        if(!isDecorating) return null;

        const userId = GetSessionDataManager().userId;
        const userName = GetSessionDataManager().userName;
        const roomIndex = GetRoomSession().ownRoomIndex;

        return <AvatarInfoWidgetDecorateView userId={ userId } userName={ userName } roomIndex={ roomIndex } setIsDecorating={ setIsDecorating } />;
    }, [ isDecorating ]);

    const clearInfoStandEvent = useCallback(() =>
    {
        setInfoStandEvent(null);
    }, []);

    const currentView = useMemo(() =>
    {
        if(isGameMode) return null;

        if(decorateView) return decorateView;

        if(name) return <AvatarInfoWidgetNameView event={ name } />;

        if(infoStandEvent)
        {
            switch(infoStandEvent.type)
            {
                case RoomWidgetUpdateInfostandUserEvent.OWN_USER:
                case RoomWidgetUpdateInfostandUserEvent.PEER: {
                    const event = (infoStandEvent as RoomWidgetUpdateInfostandUserEvent);

                    if(event.isSpectatorMode) return null;

                    // if existing name bubble remove it

                    if(event.isOwnUser)
                    {
                        if(RoomEnterEffect.isRunning()) return null;

                        return <AvatarInfoWidgetOwnAvatarView userData={ event } isDancing={ isDancing } setIsDecorating={ setIsDecorating } close={ clearInfoStandEvent } />;
                    }

                    return <AvatarInfoWidgetAvatarView userData={ event } close={ clearInfoStandEvent } />;
                }
                case RoomWidgetUpdateInfostandPetEvent.PET_INFO: {
                    const event = (infoStandEvent as RoomWidgetUpdateInfostandPetEvent);

                    if(event.isOwner)
                    {
                        return <AvatarInfoWidgetOwnPetView petData={ event } close={ clearInfoStandEvent } />;
                    }

                    return <AvatarInfoWidgetPetView petData={ event } close={ clearInfoStandEvent } />;
                }
                case RoomWidgetUpdateInfostandRentableBotEvent.RENTABLE_BOT: {
                    return <AvatarInfoWidgetRentableBotView rentableBotData={ (infoStandEvent as RoomWidgetUpdateInfostandRentableBotEvent) } close={ clearInfoStandEvent } />
                }
                case RoomWidgetUpdateInfostandFurniEvent.FURNI: {
                    return null;
                }
            }
        }

        return null;
    }, [ isGameMode, decorateView, name, isDancing, infoStandEvent, clearInfoStandEvent ]);

    return (
        <>
            { currentView }
        </>
    )
}
