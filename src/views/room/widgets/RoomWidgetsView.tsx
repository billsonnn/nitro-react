import { RoomEngineEvent, RoomEngineObjectEvent, RoomEngineRoomAdEvent, RoomEngineTriggerWidgetEvent, RoomEngineUseProductEvent, RoomId, RoomObjectCategory, RoomObjectOperationType, RoomObjectVariable, RoomSessionChatEvent, RoomSessionDanceEvent, RoomSessionDimmerPresetsEvent, RoomSessionDoorbellEvent, RoomSessionErrorMessageEvent, RoomSessionEvent, RoomSessionFriendRequestEvent, RoomSessionPetInfoUpdateEvent, RoomSessionPetStatusUpdateEvent, RoomSessionPollEvent, RoomSessionPresentEvent, RoomSessionUserBadgesEvent, RoomSessionUserFigureUpdateEvent, RoomSessionWordQuizEvent, RoomZoomEvent } from '@nitrots/nitro-renderer';
import { FC, useCallback } from 'react';
import { CanManipulateFurniture, GetRoomEngine, GetSessionDataManager, IsFurnitureSelectionDisabled, LocalizeText, ProcessRoomObjectOperation, RoomWidgetFurniToWidgetMessage, RoomWidgetUpdateRoomEngineEvent, RoomWidgetUpdateRoomObjectEvent } from '../../../api';
import { FriendRequestEvent } from '../../../events';
import { useRoomEngineEvent, useRoomSessionManagerEvent, useUiEvent } from '../../../hooks';
import { NotificationAlertType } from '../../notification-center/common/NotificationAlertType';
import { NotificationUtilities } from '../../notification-center/common/NotificationUtilities';
import { useRoomContext } from '../context/RoomContext';
import { AvatarInfoWidgetView } from './avatar-info/AvatarInfoWidgetView';
import { ChatInputView } from './chat-input/ChatInputView';
import { ChatWidgetView } from './chat/ChatWidgetView';
import { FurniChooserWidgetView } from './choosers/FurniChooserWidgetView';
import { UserChooserWidgetView } from './choosers/UserChooserWidgetView';
import { DoorbellWidgetView } from './doorbell/DoorbellWidgetView';
import { FriendRequestWidgetView } from './friend-request/FriendRequestWidgetView';
import { FurnitureWidgetsView } from './furniture/FurnitureWidgetsView';
import { InfoStandWidgetView } from './infostand/InfoStandWidgetView';
import { RoomThumbnailWidgetView } from './room-thumbnail/RoomThumbnailWidgetView';
import { RoomToolsWidgetView } from './room-tools/RoomToolsWidgetView';
import { WordQuizWidgetView } from './word-quiz/WordQuizWidgetView';

export const RoomWidgetsView: FC<{}> = props =>
{
    const { roomSession = null, eventDispatcher = null, widgetHandler = null } = useRoomContext();

    const onRoomEngineEvent = useCallback((event: RoomEngineEvent) =>
    {
        if(!eventDispatcher || RoomId.isRoomPreviewerId(event.roomId)) return;

        switch(event.type)
        {
            case RoomEngineEvent.NORMAL_MODE:
                eventDispatcher.dispatchEvent(new RoomWidgetUpdateRoomEngineEvent(RoomWidgetUpdateRoomEngineEvent.NORMAL_MODE, event.roomId));
                return;
            case RoomEngineEvent.GAME_MODE:
                eventDispatcher.dispatchEvent(new RoomWidgetUpdateRoomEngineEvent(RoomWidgetUpdateRoomEngineEvent.GAME_MODE, event.roomId));
                return;
            case RoomZoomEvent.ROOM_ZOOM: {
                const zoomEvent = (event as RoomZoomEvent);

                let zoomLevel = ((zoomEvent.level < 1) ? 0.5 : (1 << (Math.floor(zoomEvent.level) - 1)));

                if(zoomEvent.forceFlip || zoomEvent.asDelta) zoomLevel = zoomEvent.level;

                GetRoomEngine().setRoomInstanceRenderingCanvasScale(event.roomId, 1, zoomLevel, null, null, false, zoomEvent.asDelta);

                return;
            }
        }
    }, [ eventDispatcher ]);

    useRoomEngineEvent(RoomEngineEvent.NORMAL_MODE, onRoomEngineEvent);
    useRoomEngineEvent(RoomEngineEvent.GAME_MODE, onRoomEngineEvent);
    useRoomEngineEvent(RoomZoomEvent.ROOM_ZOOM, onRoomEngineEvent);

    const handleRoomAdClick = useCallback((event: RoomEngineRoomAdEvent) =>
    {

    }, []);

    const handleRoomAdTooltip = useCallback((event: RoomEngineRoomAdEvent) =>
    {

    }, []);

    const onRoomEngineObjectEvent = useCallback((event: RoomEngineObjectEvent) =>
    {
        if(!roomSession || !widgetHandler) return;

        const objectId  = event.objectId;
        const category  = event.category;

        let updateEvent: RoomWidgetUpdateRoomObjectEvent = null;

        switch(event.type)
        {
            case RoomEngineObjectEvent.SELECTED:
                if(!IsFurnitureSelectionDisabled(event)) updateEvent = new RoomWidgetUpdateRoomObjectEvent(RoomWidgetUpdateRoomObjectEvent.OBJECT_SELECTED, objectId, category, event.roomId);
                break;
            case RoomEngineObjectEvent.DESELECTED:
                updateEvent = new RoomWidgetUpdateRoomObjectEvent(RoomWidgetUpdateRoomObjectEvent.OBJECT_DESELECTED, objectId, category, event.roomId);
                break;
            case RoomEngineObjectEvent.ADDED: {
                let addedEventType: string = null;

                switch(category)
                {
                    case RoomObjectCategory.FLOOR:
                    case RoomObjectCategory.WALL:
                        addedEventType = RoomWidgetUpdateRoomObjectEvent.FURNI_ADDED;
                        break;
                    case RoomObjectCategory.UNIT:
                        addedEventType = RoomWidgetUpdateRoomObjectEvent.USER_ADDED;
                        break;
                }

                if(addedEventType) updateEvent = new RoomWidgetUpdateRoomObjectEvent(addedEventType, objectId, category, event.roomId);
                break;
            }
            case RoomEngineObjectEvent.REMOVED: {
                let removedEventType: string = null;

                switch(category)
                {
                    case RoomObjectCategory.FLOOR:
                    case RoomObjectCategory.WALL:
                        removedEventType = RoomWidgetUpdateRoomObjectEvent.FURNI_REMOVED;
                        break;
                    case RoomObjectCategory.UNIT:
                        removedEventType = RoomWidgetUpdateRoomObjectEvent.USER_REMOVED;
                        break;
                }

                if(removedEventType) updateEvent = new RoomWidgetUpdateRoomObjectEvent(removedEventType, objectId, category, event.roomId);
                break;
            }
            case RoomEngineObjectEvent.REQUEST_MOVE:
                if(CanManipulateFurniture(roomSession, objectId, category)) ProcessRoomObjectOperation(objectId, category, RoomObjectOperationType.OBJECT_MOVE);
                break;
            case RoomEngineObjectEvent.REQUEST_ROTATE:
                if(CanManipulateFurniture(roomSession, objectId, category)) ProcessRoomObjectOperation(objectId, category, RoomObjectOperationType.OBJECT_ROTATE_POSITIVE);
                break;
            case RoomEngineObjectEvent.REQUEST_MANIPULATION:
                if(CanManipulateFurniture(roomSession, objectId, category)) updateEvent = new RoomWidgetUpdateRoomObjectEvent(RoomWidgetUpdateRoomObjectEvent.OBJECT_REQUEST_MANIPULATION, objectId, category, event.roomId);
                break;
            case RoomEngineObjectEvent.MOUSE_ENTER:
                updateEvent = new RoomWidgetUpdateRoomObjectEvent(RoomWidgetUpdateRoomObjectEvent.OBJECT_ROLL_OVER, objectId, category, event.roomId);
                break;
            case RoomEngineObjectEvent.MOUSE_LEAVE:
                updateEvent = new RoomWidgetUpdateRoomObjectEvent(RoomWidgetUpdateRoomObjectEvent.OBJECT_ROLL_OUT, objectId, category, event.roomId);
                break;
            case RoomEngineTriggerWidgetEvent.REQUEST_CREDITFURNI:
                widgetHandler.processWidgetMessage(new RoomWidgetFurniToWidgetMessage(RoomWidgetFurniToWidgetMessage.REQUEST_CREDITFURNI, objectId, category, event.roomId));
                break;
            case RoomEngineTriggerWidgetEvent.REQUEST_STICKIE:
                widgetHandler.processWidgetMessage(new RoomWidgetFurniToWidgetMessage(RoomWidgetFurniToWidgetMessage.REQUEST_STICKIE, objectId, category, event.roomId));
                break;
            case RoomEngineTriggerWidgetEvent.REQUEST_PRESENT:
                widgetHandler.processWidgetMessage(new RoomWidgetFurniToWidgetMessage(RoomWidgetFurniToWidgetMessage.REQUEST_PRESENT, objectId, category, event.roomId));
                break;
            case RoomEngineTriggerWidgetEvent.REQUEST_TROPHY:
                widgetHandler.processWidgetMessage(new RoomWidgetFurniToWidgetMessage(RoomWidgetFurniToWidgetMessage.REQUEST_TROPHY, objectId, category, event.roomId));
                break;
            case RoomEngineTriggerWidgetEvent.REQUEST_TEASER:
                widgetHandler.processWidgetMessage(new RoomWidgetFurniToWidgetMessage(RoomWidgetFurniToWidgetMessage.REQUEST_TEASER, objectId, category, event.roomId));
                break;
            case RoomEngineTriggerWidgetEvent.REQUEST_ECOTRONBOX:
                widgetHandler.processWidgetMessage(new RoomWidgetFurniToWidgetMessage(RoomWidgetFurniToWidgetMessage.REQUEST_ECOTRONBOX, objectId, category, event.roomId));
                break;
            case RoomEngineTriggerWidgetEvent.REQUEST_DIMMER:
                widgetHandler.processWidgetMessage(new RoomWidgetFurniToWidgetMessage(RoomWidgetFurniToWidgetMessage.REQUEST_DIMMER, objectId, category, event.roomId));
                break;
            case RoomEngineTriggerWidgetEvent.REQUEST_PLACEHOLDER:
                widgetHandler.processWidgetMessage(new RoomWidgetFurniToWidgetMessage(RoomWidgetFurniToWidgetMessage.REQUEST_PLACEHOLDER, objectId, category, event.roomId));
                break;
            case RoomEngineTriggerWidgetEvent.REQUEST_CLOTHING_CHANGE:
                widgetHandler.processWidgetMessage(new RoomWidgetFurniToWidgetMessage(RoomWidgetFurniToWidgetMessage.REQUEST_CLOTHING_CHANGE, objectId, category, event.roomId));
                break;
            case RoomEngineTriggerWidgetEvent.REQUEST_PLAYLIST_EDITOR:
                widgetHandler.processWidgetMessage(new RoomWidgetFurniToWidgetMessage(RoomWidgetFurniToWidgetMessage.REQUEST_PLAYLIST_EDITOR, objectId, category, event.roomId));
                break;
            case RoomEngineTriggerWidgetEvent.REQUEST_ACHIEVEMENT_RESOLUTION_ENGRAVING:
                widgetHandler.processWidgetMessage(new RoomWidgetFurniToWidgetMessage(RoomWidgetFurniToWidgetMessage.REQUEST_ACHIEVEMENT_RESOLUTION_ENGRAVING, objectId, category, event.roomId));
                break;
            case RoomEngineTriggerWidgetEvent.REQUEST_BADGE_DISPLAY_ENGRAVING:
                widgetHandler.processWidgetMessage(new RoomWidgetFurniToWidgetMessage(RoomWidgetFurniToWidgetMessage.REQUEST_BADGE_DISPLAY_ENGRAVING, objectId, category, event.roomId));
                break;
            case RoomEngineTriggerWidgetEvent.REQUEST_ACHIEVEMENT_RESOLUTION_FAILED: {
                const roomObject = GetRoomEngine().getRoomObject(event.roomId, objectId, category);
                const ownerId = roomObject.model.getValue<number>(RoomObjectVariable.FURNITURE_OWNER_ID);

                if(ownerId === GetSessionDataManager().userId)
                {
                    widgetHandler.processWidgetMessage(new RoomWidgetFurniToWidgetMessage(RoomWidgetFurniToWidgetMessage.REQUEST_ACHIEVEMENT_RESOLUTION_FAILED, objectId, category, event.roomId));
                }
                break;
            }
            case RoomEngineTriggerWidgetEvent.OPEN_WIDGET:
            case RoomEngineTriggerWidgetEvent.CLOSE_WIDGET:
            case RoomEngineTriggerWidgetEvent.OPEN_FURNI_CONTEXT_MENU:
            case RoomEngineTriggerWidgetEvent.CLOSE_FURNI_CONTEXT_MENU:
            case RoomEngineTriggerWidgetEvent.REMOVE_DIMMER:
            case RoomEngineTriggerWidgetEvent.REQUEST_MANNEQUIN:
            case RoomEngineUseProductEvent.USE_PRODUCT_FROM_INVENTORY:
            case RoomEngineUseProductEvent.USE_PRODUCT_FROM_ROOM:
            case RoomEngineTriggerWidgetEvent.REQUEST_BACKGROUND_COLOR:
            case RoomEngineTriggerWidgetEvent.REQUEST_FRIEND_FURNITURE_ENGRAVING:
            case RoomEngineTriggerWidgetEvent.REQUEST_HIGH_SCORE_DISPLAY:
            case RoomEngineTriggerWidgetEvent.REQUEST_HIDE_HIGH_SCORE_DISPLAY:
            case RoomEngineTriggerWidgetEvent.REQUEST_INTERNAL_LINK:
            case RoomEngineTriggerWidgetEvent.REQUEST_ROOM_LINK:
                widgetHandler.processEvent(event);
                break;
            case RoomEngineRoomAdEvent.FURNI_CLICK:
            case RoomEngineRoomAdEvent.FURNI_DOUBLE_CLICK:
                handleRoomAdClick(event);
                break;
            case RoomEngineRoomAdEvent.TOOLTIP_SHOW:
            case RoomEngineRoomAdEvent.TOOLTIP_HIDE:
                handleRoomAdTooltip(event);
                break;
        }

        if(updateEvent)
        {
            let dispatchEvent = true;

            if(updateEvent instanceof RoomWidgetUpdateRoomObjectEvent) dispatchEvent = (!RoomId.isRoomPreviewerId(updateEvent.roomId));

            if(dispatchEvent) widgetHandler.eventDispatcher.dispatchEvent(updateEvent);
        }
    }, [ roomSession, widgetHandler, handleRoomAdClick, handleRoomAdTooltip ]);

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
    useRoomEngineEvent(RoomEngineTriggerWidgetEvent.REQUEST_CREDITFURNI, onRoomEngineObjectEvent);
    useRoomEngineEvent(RoomEngineTriggerWidgetEvent.REQUEST_STICKIE, onRoomEngineObjectEvent);
    useRoomEngineEvent(RoomEngineTriggerWidgetEvent.REQUEST_PRESENT, onRoomEngineObjectEvent);
    useRoomEngineEvent(RoomEngineTriggerWidgetEvent.REQUEST_TROPHY, onRoomEngineObjectEvent);
    useRoomEngineEvent(RoomEngineTriggerWidgetEvent.REQUEST_TEASER, onRoomEngineObjectEvent);
    useRoomEngineEvent(RoomEngineTriggerWidgetEvent.REQUEST_ECOTRONBOX, onRoomEngineObjectEvent);
    useRoomEngineEvent(RoomEngineTriggerWidgetEvent.REQUEST_DIMMER, onRoomEngineObjectEvent);
    useRoomEngineEvent(RoomEngineTriggerWidgetEvent.REQUEST_PLACEHOLDER, onRoomEngineObjectEvent);
    useRoomEngineEvent(RoomEngineTriggerWidgetEvent.REQUEST_CLOTHING_CHANGE, onRoomEngineObjectEvent);
    useRoomEngineEvent(RoomEngineTriggerWidgetEvent.REQUEST_PLAYLIST_EDITOR, onRoomEngineObjectEvent);
    useRoomEngineEvent(RoomEngineTriggerWidgetEvent.REQUEST_ACHIEVEMENT_RESOLUTION_ENGRAVING, onRoomEngineObjectEvent);
    useRoomEngineEvent(RoomEngineTriggerWidgetEvent.REQUEST_BADGE_DISPLAY_ENGRAVING, onRoomEngineObjectEvent);
    useRoomEngineEvent(RoomEngineTriggerWidgetEvent.REQUEST_ACHIEVEMENT_RESOLUTION_FAILED, onRoomEngineObjectEvent);
    useRoomEngineEvent(RoomEngineTriggerWidgetEvent.OPEN_WIDGET, onRoomEngineObjectEvent);
    useRoomEngineEvent(RoomEngineTriggerWidgetEvent.CLOSE_WIDGET, onRoomEngineObjectEvent);
    useRoomEngineEvent(RoomEngineTriggerWidgetEvent.OPEN_FURNI_CONTEXT_MENU, onRoomEngineObjectEvent);
    useRoomEngineEvent(RoomEngineTriggerWidgetEvent.CLOSE_FURNI_CONTEXT_MENU, onRoomEngineObjectEvent);
    useRoomEngineEvent(RoomEngineTriggerWidgetEvent.REMOVE_DIMMER, onRoomEngineObjectEvent);
    useRoomEngineEvent(RoomEngineTriggerWidgetEvent.REQUEST_MANNEQUIN, onRoomEngineObjectEvent);
    useRoomEngineEvent(RoomEngineUseProductEvent.USE_PRODUCT_FROM_INVENTORY, onRoomEngineObjectEvent);
    useRoomEngineEvent(RoomEngineUseProductEvent.USE_PRODUCT_FROM_ROOM, onRoomEngineObjectEvent);
    useRoomEngineEvent(RoomEngineTriggerWidgetEvent.REQUEST_BACKGROUND_COLOR, onRoomEngineObjectEvent);
    useRoomEngineEvent(RoomEngineTriggerWidgetEvent.REQUEST_FRIEND_FURNITURE_ENGRAVING, onRoomEngineObjectEvent);
    useRoomEngineEvent(RoomEngineTriggerWidgetEvent.REQUEST_HIGH_SCORE_DISPLAY, onRoomEngineObjectEvent);
    useRoomEngineEvent(RoomEngineTriggerWidgetEvent.REQUEST_HIDE_HIGH_SCORE_DISPLAY, onRoomEngineObjectEvent);
    useRoomEngineEvent(RoomEngineTriggerWidgetEvent.REQUEST_INTERNAL_LINK, onRoomEngineObjectEvent);
    useRoomEngineEvent(RoomEngineTriggerWidgetEvent.REQUEST_ROOM_LINK, onRoomEngineObjectEvent);
    useRoomEngineEvent(RoomEngineRoomAdEvent.FURNI_CLICK, onRoomEngineObjectEvent);
    useRoomEngineEvent(RoomEngineRoomAdEvent.FURNI_DOUBLE_CLICK, onRoomEngineObjectEvent);
    useRoomEngineEvent(RoomEngineRoomAdEvent.TOOLTIP_SHOW, onRoomEngineObjectEvent);
    useRoomEngineEvent(RoomEngineRoomAdEvent.TOOLTIP_HIDE, onRoomEngineObjectEvent);

    const onRoomSessionEvent = useCallback((event: RoomSessionEvent) =>
    {
        if(!widgetHandler) return;

        widgetHandler.processEvent(event);
    }, [ widgetHandler ]);

    useRoomSessionManagerEvent(RoomSessionChatEvent.CHAT_EVENT, onRoomSessionEvent);
    useRoomSessionManagerEvent(RoomSessionChatEvent.FLOOD_EVENT, onRoomSessionEvent);
    useRoomSessionManagerEvent(RoomSessionDanceEvent.RSDE_DANCE, onRoomSessionEvent);
    useRoomSessionManagerEvent(RoomSessionUserBadgesEvent.RSUBE_BADGES, onRoomSessionEvent);
    useRoomSessionManagerEvent(RoomSessionUserFigureUpdateEvent.USER_FIGURE, onRoomSessionEvent);
    useRoomSessionManagerEvent(RoomSessionPetStatusUpdateEvent.PET_STATUS_UPDATE, onRoomSessionEvent);
    useRoomSessionManagerEvent(RoomSessionDoorbellEvent.DOORBELL, onRoomSessionEvent);
    useRoomSessionManagerEvent(RoomSessionDoorbellEvent.RSDE_REJECTED, onRoomSessionEvent);
    useRoomSessionManagerEvent(RoomSessionDoorbellEvent.RSDE_ACCEPTED, onRoomSessionEvent);
    useRoomSessionManagerEvent(RoomSessionDimmerPresetsEvent.ROOM_DIMMER_PRESETS, onRoomSessionEvent);
    useRoomSessionManagerEvent(RoomSessionFriendRequestEvent.RSFRE_FRIEND_REQUEST, onRoomSessionEvent);
    useRoomSessionManagerEvent(RoomSessionPresentEvent.RSPE_PRESENT_OPENED, onRoomSessionEvent);
    useRoomSessionManagerEvent(RoomSessionPetInfoUpdateEvent.PET_INFO, onRoomSessionEvent);
    useRoomSessionManagerEvent(RoomSessionWordQuizEvent.ANSWERED, onRoomSessionEvent);
    useRoomSessionManagerEvent(RoomSessionWordQuizEvent.FINISHED, onRoomSessionEvent);
    useRoomSessionManagerEvent(RoomSessionWordQuizEvent.QUESTION, onRoomSessionEvent);
    useRoomSessionManagerEvent(RoomSessionPollEvent.OFFER, onRoomSessionEvent);
    useRoomSessionManagerEvent(RoomSessionPollEvent.ERROR, onRoomSessionEvent);
    useRoomSessionManagerEvent(RoomSessionPollEvent.CONTENT, onRoomSessionEvent);
    useUiEvent(FriendRequestEvent.ACCEPTED, onRoomSessionEvent);
    useUiEvent(FriendRequestEvent.DECLINED, onRoomSessionEvent);

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

        NotificationUtilities.simpleAlert(errorMessage, NotificationAlertType.DEFAULT, null, null, errorTitle);
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
            <ChatWidgetView />
            <ChatInputView />
            <DoorbellWidgetView />
            <FurnitureWidgetsView />
            <InfoStandWidgetView />
            <RoomToolsWidgetView />
            <RoomThumbnailWidgetView />
            <FurniChooserWidgetView />
            <UserChooserWidgetView />
            <WordQuizWidgetView />
            <FriendRequestWidgetView />
        </>
    );
}
