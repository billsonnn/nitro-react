import { RoomEngineDimmerStateEvent, RoomEngineEvent, RoomEngineObjectEvent, RoomEngineTriggerWidgetEvent, RoomEngineUseProductEvent, RoomId, RoomObjectCategory, RoomObjectOperationType, RoomSessionChatEvent, RoomSessionDanceEvent, RoomSessionDimmerPresetsEvent, RoomSessionDoorbellEvent, RoomSessionErrorMessageEvent, RoomSessionEvent, RoomSessionFriendRequestEvent, RoomSessionPetInfoUpdateEvent, RoomSessionPresentEvent, RoomSessionUserBadgesEvent, RoomZoomEvent } from '@nitrots/nitro-renderer';
import { FC, useCallback } from 'react';
import { CanManipulateFurniture, GetRoomEngine, IsFurnitureSelectionDisabled, ProcessRoomObjectOperation } from '../../../api';
import { useRoomEngineEvent, useRoomSessionManagerEvent } from '../../../hooks/events';
import { LocalizeText } from '../../../utils/LocalizeText';
import { useRoomContext } from '../context/RoomContext';
import { RoomWidgetRoomEngineUpdateEvent, RoomWidgetRoomObjectUpdateEvent } from '../events';
import { AvatarInfoWidgetView } from './avatar-info/AvatarInfoWidgetView';
import { CameraWidgetView } from './camera/CameraWidgetView';
import { ChatInputView } from './chat-input/ChatInputView';
import { ChatWidgetView } from './chat/ChatWidgetView';
import { FurnitureWidgetsView } from './furniture/FurnitureWidgetsView';
import { InfoStandWidgetView } from './infostand/InfoStandWidgetView';
import { RoomThumbnailWidgetView } from './room-thumbnail/RoomThumbnailWidgetView';
import { RoomToolsWidgetView } from './room-tools/RoomToolsWidgetView';
import { RoomWidgetViewProps } from './RoomWidgets.types';
export const RoomWidgetsView: FC<RoomWidgetViewProps> = props =>
{
    const { roomSession = null, eventDispatcher = null, widgetHandler = null } = useRoomContext();

    const onRoomEngineEvent = useCallback((event: RoomEngineEvent) =>
    {
        if(!eventDispatcher || RoomId.isRoomPreviewerId(event.roomId)) return;

        switch(event.type)
        {
            case RoomEngineEvent.NORMAL_MODE:
                eventDispatcher.dispatchEvent(new RoomWidgetRoomEngineUpdateEvent(RoomWidgetRoomEngineUpdateEvent.NORMAL_MODE, event.roomId));
                return;
            case RoomEngineEvent.GAME_MODE:
                eventDispatcher.dispatchEvent(new RoomWidgetRoomEngineUpdateEvent(RoomWidgetRoomEngineUpdateEvent.GAME_MODE, event.roomId));
                return;
            case RoomZoomEvent.ROOM_ZOOM: {
                const zoomEvent = (event as RoomZoomEvent);

                let zoomLevel = ((zoomEvent.level < 1) ? 0.5 : (1 << (Math.floor(zoomEvent.level) - 1)));

                if(zoomEvent.forceFlip || zoomEvent.asDelta) zoomLevel = zoomEvent.level;

                GetRoomEngine().setRoomInstanceRenderingCanvasScale(event.roomId, 1, zoomLevel, null, null, false, zoomEvent.asDelta);

                return;
            }
            case RoomEngineDimmerStateEvent.ROOM_COLOR: {
                return;
            }
        }
    }, [ eventDispatcher ]);

    useRoomEngineEvent(RoomEngineEvent.NORMAL_MODE, onRoomEngineEvent);
    useRoomEngineEvent(RoomEngineEvent.GAME_MODE, onRoomEngineEvent);
    useRoomEngineEvent(RoomZoomEvent.ROOM_ZOOM, onRoomEngineEvent);
    useRoomEngineEvent(RoomEngineDimmerStateEvent.ROOM_COLOR, onRoomEngineEvent);

    const onRoomEngineObjectEvent = useCallback((event: RoomEngineObjectEvent) =>
    {
        if(!roomSession || !widgetHandler) return;

        const objectId  = event.objectId;
        const category  = event.category;

        let updateEvent: RoomWidgetRoomObjectUpdateEvent = null;

        switch(event.type)
        {
            case RoomEngineObjectEvent.SELECTED:
                if(!IsFurnitureSelectionDisabled(event)) updateEvent = new RoomWidgetRoomObjectUpdateEvent(RoomWidgetRoomObjectUpdateEvent.OBJECT_SELECTED, objectId, category, event.roomId);
                break;
            case RoomEngineObjectEvent.DESELECTED:
                updateEvent = new RoomWidgetRoomObjectUpdateEvent(RoomWidgetRoomObjectUpdateEvent.OBJECT_DESELECTED, objectId, category, event.roomId);
                break;
            case RoomEngineObjectEvent.ADDED: {
                let addedEventType: string = null;

                switch(category)
                {
                    case RoomObjectCategory.FLOOR:
                    case RoomObjectCategory.WALL:
                        addedEventType = RoomWidgetRoomObjectUpdateEvent.FURNI_ADDED;
                        break;
                    case RoomObjectCategory.UNIT:
                        addedEventType = RoomWidgetRoomObjectUpdateEvent.USER_ADDED;
                        break;
                }

                if(addedEventType) updateEvent = new RoomWidgetRoomObjectUpdateEvent(addedEventType, objectId, category, event.roomId);
                break;
            }
            case RoomEngineObjectEvent.REMOVED: {
                let removedEventType: string = null;

                switch(category)
                {
                    case RoomObjectCategory.FLOOR:
                    case RoomObjectCategory.WALL:
                        removedEventType = RoomWidgetRoomObjectUpdateEvent.FURNI_REMOVED;
                        break;
                    case RoomObjectCategory.UNIT:
                        removedEventType = RoomWidgetRoomObjectUpdateEvent.USER_REMOVED;
                        break;
                }

                if(removedEventType) updateEvent = new RoomWidgetRoomObjectUpdateEvent(removedEventType, objectId, category, event.roomId);
                break;
            }
            case RoomEngineObjectEvent.REQUEST_MOVE:
                if(CanManipulateFurniture(roomSession, objectId, category)) ProcessRoomObjectOperation(objectId, category, RoomObjectOperationType.OBJECT_MOVE);
                break;
            case RoomEngineObjectEvent.REQUEST_ROTATE:
                if(CanManipulateFurniture(roomSession, objectId, category)) ProcessRoomObjectOperation(objectId, category, RoomObjectOperationType.OBJECT_ROTATE_POSITIVE);
                break;
            case RoomEngineObjectEvent.REQUEST_MANIPULATION:
                if(CanManipulateFurniture(roomSession, objectId, category)) updateEvent = new RoomWidgetRoomObjectUpdateEvent(RoomWidgetRoomObjectUpdateEvent.OBJECT_REQUEST_MANIPULATION, objectId, category, event.roomId);
                break;
            case RoomEngineObjectEvent.MOUSE_ENTER:
                updateEvent = new RoomWidgetRoomObjectUpdateEvent(RoomWidgetRoomObjectUpdateEvent.OBJECT_ROLL_OVER, objectId, category, event.roomId);
                break;
            case RoomEngineObjectEvent.MOUSE_LEAVE:
                updateEvent = new RoomWidgetRoomObjectUpdateEvent(RoomWidgetRoomObjectUpdateEvent.OBJECT_ROLL_OUT, objectId, category, event.roomId);
                break;
            case RoomEngineUseProductEvent.USE_PRODUCT_FROM_INVENTORY:
            case RoomEngineUseProductEvent.USE_PRODUCT_FROM_ROOM:
            case RoomEngineTriggerWidgetEvent.OPEN_WIDGET:
            case RoomEngineTriggerWidgetEvent.CLOSE_WIDGET:
                widgetHandler.processEvent(event);
                break;
        }

        if(updateEvent)
        {
            let dispatchEvent = true;

            if(updateEvent instanceof RoomWidgetRoomObjectUpdateEvent) dispatchEvent = (!RoomId.isRoomPreviewerId(updateEvent.roomId));

            if(dispatchEvent) widgetHandler.eventDispatcher.dispatchEvent(updateEvent);
        }
    }, [ roomSession, widgetHandler ]);

    useRoomEngineEvent(RoomEngineObjectEvent.SELECTED, onRoomEngineObjectEvent);
    useRoomEngineEvent(RoomEngineObjectEvent.DESELECTED, onRoomEngineObjectEvent);
    useRoomEngineEvent(RoomEngineObjectEvent.ADDED, onRoomEngineObjectEvent);
    useRoomEngineEvent(RoomEngineObjectEvent.REMOVED, onRoomEngineObjectEvent);
    useRoomEngineEvent(RoomEngineObjectEvent.PLACED, onRoomEngineObjectEvent);
    useRoomEngineEvent(RoomEngineObjectEvent.REQUEST_MOVE, onRoomEngineObjectEvent);
    useRoomEngineEvent(RoomEngineObjectEvent.REQUEST_ROTATE, onRoomEngineObjectEvent);
    useRoomEngineEvent(RoomEngineObjectEvent.REQUEST_MANIPULATION, onRoomEngineObjectEvent);
    useRoomEngineEvent(RoomEngineObjectEvent.MOUSE_ENTER, onRoomEngineObjectEvent);
    useRoomEngineEvent(RoomEngineObjectEvent.MOUSE_LEAVE, onRoomEngineObjectEvent);
    useRoomEngineEvent(RoomEngineUseProductEvent.USE_PRODUCT_FROM_INVENTORY, onRoomEngineObjectEvent);
    useRoomEngineEvent(RoomEngineUseProductEvent.USE_PRODUCT_FROM_ROOM, onRoomEngineObjectEvent);
    useRoomEngineEvent(RoomEngineTriggerWidgetEvent.OPEN_WIDGET, onRoomEngineObjectEvent);
    useRoomEngineEvent(RoomEngineTriggerWidgetEvent.CLOSE_WIDGET, onRoomEngineObjectEvent);

    const onRoomSessionEvent = useCallback((event: RoomSessionEvent) =>
    {
        if(!widgetHandler) return;

        widgetHandler.processEvent(event);
    }, [ widgetHandler ]);

    useRoomSessionManagerEvent(RoomSessionChatEvent.CHAT_EVENT, onRoomSessionEvent);
    useRoomSessionManagerEvent(RoomSessionChatEvent.FLOOD_EVENT, onRoomSessionEvent);
    useRoomSessionManagerEvent(RoomSessionDanceEvent.RSDE_DANCE, onRoomSessionEvent);
    useRoomSessionManagerEvent(RoomSessionUserBadgesEvent.RSUBE_BADGES, onRoomSessionEvent);
    useRoomSessionManagerEvent(RoomSessionDoorbellEvent.DOORBELL, onRoomSessionEvent);
    useRoomSessionManagerEvent(RoomSessionDoorbellEvent.RSDE_REJECTED, onRoomSessionEvent);
    useRoomSessionManagerEvent(RoomSessionDoorbellEvent.RSDE_ACCEPTED, onRoomSessionEvent);
    useRoomSessionManagerEvent(RoomSessionDimmerPresetsEvent.ROOM_DIMMER_PRESETS, onRoomSessionEvent);
    useRoomSessionManagerEvent(RoomSessionFriendRequestEvent.RSFRE_FRIEND_REQUEST, onRoomSessionEvent);
    useRoomSessionManagerEvent(RoomSessionPresentEvent.RSPE_PRESENT_OPENED, onRoomSessionEvent);
    useRoomSessionManagerEvent(RoomSessionPetInfoUpdateEvent.PET_INFO, onRoomSessionEvent);

    const onRoomSessionErrorMessageEvent = useCallback((event: RoomSessionErrorMessageEvent) =>
    {
        if(!event) return;

        let errorTitle = LocalizeText('error.title');
        let errorMessage: string = '';

        switch(event.type)
        {
            case RoomSessionErrorMessageEvent.RSEME_MAX_PETS:
                errorMessage = LocalizeText('room.error.max_pets');
                break;
            case RoomSessionErrorMessageEvent.RSEME_MAX_NUMBER_OF_OWN_PETS:
                errorMessage = LocalizeText('room.error.max_own_pets');
                break;
            case RoomSessionErrorMessageEvent.RSEME_KICKED:
                errorMessage = LocalizeText('room.error.kicked');
                errorTitle = LocalizeText('generic.alert.title');
                break;
            case RoomSessionErrorMessageEvent.RSEME_PETS_FORBIDDEN_IN_HOTEL:
                errorMessage = LocalizeText('room.error.pets.forbidden_in_hotel');
                break;
            case RoomSessionErrorMessageEvent.RSEME_PETS_FORBIDDEN_IN_FLAT:
                errorMessage = LocalizeText('room.error.pets.forbidden_in_flat');
                break;
            case RoomSessionErrorMessageEvent.RSEME_NO_FREE_TILES_FOR_PET:
                errorMessage = LocalizeText('room.error.pets.no_free_tiles');
                break;
            case RoomSessionErrorMessageEvent.RSEME_SELECTED_TILE_NOT_FREE_FOR_PET:
                errorMessage = LocalizeText('room.error.pets.selected_tile_not_free');
                break;
            case RoomSessionErrorMessageEvent.RSEME_BOTS_FORBIDDEN_IN_HOTEL:
                errorMessage = LocalizeText('room.error.bots.forbidden_in_hotel');
                break;
            case RoomSessionErrorMessageEvent.RSEME_BOTS_FORBIDDEN_IN_FLAT:
                errorMessage = LocalizeText('room.error.bots.forbidden_in_flat');
                break;
            case RoomSessionErrorMessageEvent.RSEME_BOT_LIMIT_REACHED:
                errorMessage = LocalizeText('room.error.max_bots');
                break;
            case RoomSessionErrorMessageEvent.RSEME_SELECTED_TILE_NOT_FREE_FOR_BOT:
                errorMessage = LocalizeText('room.error.bots.selected_tile_not_free');
                break;
            case RoomSessionErrorMessageEvent.RSEME_BOT_NAME_NOT_ACCEPTED:
                errorMessage = LocalizeText('room.error.bots.name.not.accepted');
                break;
            default:
                return;
        }
    }, []);

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

    if(!widgetHandler) return null;

    return (
        <>
            <AvatarInfoWidgetView />
            <CameraWidgetView />
            <ChatWidgetView />
            <ChatInputView />
            <FurnitureWidgetsView />
            <InfoStandWidgetView />
            <RoomToolsWidgetView />
            <RoomThumbnailWidgetView />
        </>
    );
}
