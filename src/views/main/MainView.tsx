import { Nitro, RoomBackgroundColorEvent, RoomEngineDimmerStateEvent, RoomEngineEvent, RoomEngineObjectEvent, RoomEngineTriggerWidgetEvent, RoomObjectHSLColorEnabledEvent, RoomObjectWidgetRequestEvent, RoomSessionChatEvent, RoomSessionDanceEvent, RoomSessionDimmerPresetsEvent, RoomSessionDoorbellEvent, RoomSessionErrorMessageEvent, RoomSessionEvent, RoomSessionFriendRequestEvent, RoomSessionPresentEvent, RoomSessionUserBadgesEvent, RoomZoomEvent } from 'nitro-renderer';
import { useCallback, useEffect, useState } from 'react';
import { useRoomEngineEvent } from '../../hooks/events/nitro/room/room-engine-event';
import { useRoomSessionManagerEvent } from '../../hooks/events/nitro/session/room-session-manager-event';
import { FadeTransition } from '../../transitions/FadeTransition';
import { HotelView } from '../hotel-view/HotelView';
import { ToolbarView } from '../toolbar/ToolbarView';
import { MainViewProps } from './MainView.types';

export function MainView(props: MainViewProps): JSX.Element
{
    const [ isReady, setIsReady ] = useState(false);

    const onInterstitialEvent = useCallback((event: RoomEngineEvent) =>
    {
        console.log(event);
    }, []);

    const onRoomEngineEvent = useCallback((event: RoomEngineEvent) =>
    {
        console.log(event);
    }, []);

    const onRoomEngineObjectEvent = useCallback((event: RoomEngineObjectEvent) =>
    {
        console.log(event);
    }, []);

    const onRoomSessionEvent = useCallback((event: RoomSessionEvent) =>
    {
        console.log(event);
    }, []);

    const onRoomSessionErrorMessageEvent = useCallback((event: RoomSessionErrorMessageEvent) =>
    {
        console.log(event);
    }, []);

    useRoomEngineEvent(RoomEngineEvent.ENGINE_INITIALIZED, onInterstitialEvent);
    useRoomEngineEvent(RoomEngineEvent.OBJECTS_INITIALIZED, onInterstitialEvent);
    useRoomEngineEvent(RoomEngineEvent.NORMAL_MODE, onInterstitialEvent);
    useRoomEngineEvent(RoomEngineEvent.GAME_MODE, onInterstitialEvent);

    useRoomEngineEvent(RoomEngineEvent.INITIALIZED, onRoomEngineEvent);
    useRoomEngineEvent(RoomEngineEvent.DISPOSED, onRoomEngineEvent);
    useRoomEngineEvent(RoomZoomEvent.ROOM_ZOOM, onRoomEngineEvent);
    useRoomEngineEvent(RoomObjectHSLColorEnabledEvent.ROOM_BACKGROUND_COLOR, onRoomEngineEvent);
    useRoomEngineEvent(RoomBackgroundColorEvent.ROOM_COLOR, onRoomEngineEvent);
    useRoomEngineEvent(RoomEngineDimmerStateEvent.ROOM_COLOR, onRoomEngineEvent);

    useRoomEngineEvent(RoomEngineObjectEvent.SELECTED, onRoomEngineObjectEvent);
    useRoomEngineEvent(RoomEngineObjectEvent.DESELECTED, onRoomEngineObjectEvent);
    useRoomEngineEvent(RoomEngineObjectEvent.ADDED, onRoomEngineObjectEvent);
    useRoomEngineEvent(RoomEngineObjectEvent.REMOVED, onRoomEngineObjectEvent);
    useRoomEngineEvent(RoomEngineObjectEvent.PLACED, onRoomEngineObjectEvent);
    useRoomEngineEvent(RoomEngineObjectEvent.REQUEST_MOVE, onRoomEngineObjectEvent);
    useRoomEngineEvent(RoomEngineObjectEvent.REQUEST_ROTATE, onRoomEngineObjectEvent);
    useRoomEngineEvent(RoomEngineObjectEvent.MOUSE_ENTER, onRoomEngineObjectEvent);
    useRoomEngineEvent(RoomEngineObjectEvent.MOUSE_LEAVE, onRoomEngineObjectEvent);
    useRoomEngineEvent(RoomEngineTriggerWidgetEvent.OPEN_WIDGET, onRoomEngineObjectEvent);
    useRoomEngineEvent(RoomEngineTriggerWidgetEvent.CLOSE_WIDGET, onRoomEngineObjectEvent);
    useRoomEngineEvent(RoomEngineTriggerWidgetEvent.REQUEST_INTERNAL_LINK, onRoomEngineObjectEvent);
    useRoomEngineEvent(RoomEngineTriggerWidgetEvent.REQUEST_ROOM_LINK, onRoomEngineObjectEvent);
    useRoomEngineEvent(RoomEngineTriggerWidgetEvent.REQUEST_TROPHY, onRoomEngineObjectEvent);
    useRoomEngineEvent(RoomEngineTriggerWidgetEvent.REQUEST_CREDITFURNI, onRoomEngineObjectEvent);
    useRoomEngineEvent(RoomObjectWidgetRequestEvent.OPEN_FURNI_CONTEXT_MENU, onRoomEngineObjectEvent);
    useRoomEngineEvent(RoomEngineTriggerWidgetEvent.REQUEST_STICKIE, onRoomEngineObjectEvent);
    useRoomEngineEvent(RoomEngineTriggerWidgetEvent.REQUEST_DIMMER, onRoomEngineObjectEvent);
    useRoomEngineEvent(RoomEngineTriggerWidgetEvent.REQUEST_BACKGROUND_COLOR, onRoomEngineObjectEvent);
    useRoomEngineEvent(RoomEngineTriggerWidgetEvent.REQUEST_FRIEND_FURNITURE_ENGRAVING, onRoomEngineObjectEvent);
    useRoomEngineEvent(RoomEngineTriggerWidgetEvent.REQUEST_MANNEQUIN, onRoomEngineObjectEvent);
    useRoomEngineEvent(RoomEngineTriggerWidgetEvent.REQUEST_PRESENT, onRoomEngineObjectEvent);
    useRoomEngineEvent(RoomEngineTriggerWidgetEvent.REQUEST_HIGH_SCORE_DISPLAY, onRoomEngineObjectEvent);
    useRoomEngineEvent(RoomEngineTriggerWidgetEvent.REQUEST_HIDE_HIGH_SCORE_DISPLAY, onRoomEngineObjectEvent);

    useRoomSessionManagerEvent(RoomSessionEvent.CREATED, onRoomSessionEvent);
    useRoomSessionManagerEvent(RoomSessionEvent.STARTED, onRoomSessionEvent);
    useRoomSessionManagerEvent(RoomSessionEvent.ROOM_DATA, onRoomSessionEvent);
    useRoomSessionManagerEvent(RoomSessionEvent.ENDED, onRoomSessionEvent);
    useRoomSessionManagerEvent(RoomSessionChatEvent.CHAT_EVENT, onRoomSessionEvent);
    useRoomSessionManagerEvent(RoomSessionChatEvent.FLOOD_EVENT, onRoomSessionEvent);
    useRoomSessionManagerEvent(RoomSessionDanceEvent.RSDE_DANCE, onRoomSessionEvent);
    useRoomSessionManagerEvent(RoomSessionUserBadgesEvent.RSUBE_BADGES, onRoomSessionEvent);
    useRoomSessionManagerEvent(RoomSessionDoorbellEvent.DOORBELL, onRoomSessionEvent);
    useRoomSessionManagerEvent(RoomSessionDoorbellEvent.RSDE_REJECTED, onRoomSessionEvent);
    useRoomSessionManagerEvent(RoomSessionDoorbellEvent.RSDE_ACCEPTED, onRoomSessionEvent);
    useRoomSessionManagerEvent(RoomSessionDimmerPresetsEvent.RSDPE_PRESETS, onRoomSessionEvent);
    useRoomSessionManagerEvent(RoomSessionFriendRequestEvent.RSFRE_FRIEND_REQUEST, onRoomSessionEvent);
    useRoomSessionManagerEvent(RoomSessionPresentEvent.RSPE_PRESENT_OPENED, onRoomSessionEvent);
    useRoomSessionManagerEvent(RoomSessionErrorMessageEvent.RSEME_KICKED, onRoomSessionErrorMessageEvent);
    useRoomSessionManagerEvent(RoomSessionErrorMessageEvent.RSEME_PETS_FORBIDDEN_IN_HOTEL, onRoomSessionErrorMessageEvent);
    useRoomSessionManagerEvent(RoomSessionErrorMessageEvent.RSEME_PETS_FORBIDDEN_IN_FLAT, onRoomSessionErrorMessageEvent);
    useRoomSessionManagerEvent(RoomSessionErrorMessageEvent.RSEME_MAX_PETS, onRoomSessionErrorMessageEvent);
    useRoomSessionManagerEvent(RoomSessionErrorMessageEvent.RSEME_MAX_NUMBER_OF_OWN_PETS, onRoomSessionErrorMessageEvent);
    useRoomSessionManagerEvent(RoomSessionErrorMessageEvent.RSEME_NO_FREE_TILES_FOR_PET, onRoomSessionErrorMessageEvent);
    useRoomSessionManagerEvent(RoomSessionErrorMessageEvent.RSEME_SELECTED_TILE_NOT_FREE_FOR_PET, onRoomSessionErrorMessageEvent);
    useRoomSessionManagerEvent(RoomSessionErrorMessageEvent.RSEME_BOTS_FORBIDDEN_IN_HOTEL, onRoomSessionErrorMessageEvent);
    useRoomSessionManagerEvent(RoomSessionErrorMessageEvent.RSEME_BOTS_FORBIDDEN_IN_FLAT, onRoomSessionErrorMessageEvent);
    useRoomSessionManagerEvent(RoomSessionErrorMessageEvent.RSEME_BOT_LIMIT_REACHED, onRoomSessionErrorMessageEvent);
    useRoomSessionManagerEvent(RoomSessionErrorMessageEvent.RSEME_SELECTED_TILE_NOT_FREE_FOR_BOT, onRoomSessionErrorMessageEvent);
    useRoomSessionManagerEvent(RoomSessionErrorMessageEvent.RSEME_BOT_NAME_NOT_ACCEPTED, onRoomSessionErrorMessageEvent);

    useEffect(() =>
    {
        setIsReady(true);

        Nitro.instance.communication.connection.onReady();
    }, []);

    return (
        <div>
            <HotelView />
            <FadeTransition inProp={ isReady } timeout={ 300 }>
                <ToolbarView />
            </FadeTransition>
        </div>
    );
}
