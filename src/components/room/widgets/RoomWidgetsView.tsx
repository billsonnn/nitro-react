import { RoomEngineEvent, RoomEngineObjectEvent, RoomEngineRoomAdEvent, RoomEngineTriggerWidgetEvent, RoomEngineUseProductEvent, RoomId, RoomSessionChatEvent, RoomSessionDanceEvent, RoomSessionDimmerPresetsEvent, RoomSessionErrorMessageEvent, RoomSessionEvent, RoomSessionFavoriteGroupUpdateEvent, RoomSessionPetInfoUpdateEvent, RoomSessionPetStatusUpdateEvent, RoomSessionPollEvent, RoomSessionUserBadgesEvent, RoomSessionUserFigureUpdateEvent, RoomSessionWordQuizEvent, RoomZoomEvent } from '@nitrots/nitro-renderer';
import { FC, useCallback } from 'react';
import { GetRoomEngine, LocalizeText, NotificationAlertType, NotificationUtilities, RoomWidgetFurniToWidgetMessage, RoomWidgetUpdateRoomEngineEvent, RoomWidgetUpdateRoomObjectEvent } from '../../../api';
import { DispatchUiEvent, UseRoomEngineEvent, UseRoomSessionManagerEvent } from '../../../hooks';
import { useRoomContext } from '../RoomContext';
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

                GetRoomEngine().setRoomInstanceRenderingCanvasScale(event.roomId, 1, zoomEvent.level, null, null, false, zoomEvent.asDelta);

                return;
            }
        }
    }, [ eventDispatcher ]);

    UseRoomEngineEvent(RoomEngineEvent.NORMAL_MODE, onRoomEngineEvent);
    UseRoomEngineEvent(RoomEngineEvent.GAME_MODE, onRoomEngineEvent);
    UseRoomEngineEvent(RoomZoomEvent.ROOM_ZOOM, onRoomEngineEvent);

    const handleRoomAdClick = useCallback((event: RoomEngineRoomAdEvent) =>
    {

    }, []);

    const handleRoomAdTooltip = useCallback((event: RoomEngineRoomAdEvent) =>
    {

    }, []);

    const onRoomEngineObjectEvent = useCallback((event: RoomEngineObjectEvent) =>
    {
        if(!roomSession || !widgetHandler) return;

        const objectId = event.objectId;
        const category = event.category;

        let updateEvent: RoomWidgetUpdateRoomObjectEvent = null;

        switch(event.type)
        {
            case RoomEngineTriggerWidgetEvent.REQUEST_TEASER:
                widgetHandler.processWidgetMessage(new RoomWidgetFurniToWidgetMessage(RoomWidgetFurniToWidgetMessage.REQUEST_TEASER, objectId, category, event.roomId));
                break;
            case RoomEngineTriggerWidgetEvent.REQUEST_ECOTRONBOX:
                widgetHandler.processWidgetMessage(new RoomWidgetFurniToWidgetMessage(RoomWidgetFurniToWidgetMessage.REQUEST_ECOTRONBOX, objectId, category, event.roomId));
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
            case RoomEngineTriggerWidgetEvent.OPEN_WIDGET:
            case RoomEngineTriggerWidgetEvent.CLOSE_WIDGET:
            case RoomEngineTriggerWidgetEvent.OPEN_FURNI_CONTEXT_MENU:
            case RoomEngineTriggerWidgetEvent.CLOSE_FURNI_CONTEXT_MENU:
            case RoomEngineUseProductEvent.USE_PRODUCT_FROM_INVENTORY:
            case RoomEngineUseProductEvent.USE_PRODUCT_FROM_ROOM:
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

            if(dispatchEvent)
            {
                widgetHandler.eventDispatcher.dispatchEvent(updateEvent);

                DispatchUiEvent(updateEvent);
            }
        }
    }, [ roomSession, widgetHandler, handleRoomAdClick, handleRoomAdTooltip ]);

    UseRoomEngineEvent(RoomEngineTriggerWidgetEvent.REQUEST_TEASER, onRoomEngineObjectEvent);
    UseRoomEngineEvent(RoomEngineTriggerWidgetEvent.REQUEST_ECOTRONBOX, onRoomEngineObjectEvent);
    UseRoomEngineEvent(RoomEngineTriggerWidgetEvent.REQUEST_PLACEHOLDER, onRoomEngineObjectEvent);
    UseRoomEngineEvent(RoomEngineTriggerWidgetEvent.REQUEST_CLOTHING_CHANGE, onRoomEngineObjectEvent);
    UseRoomEngineEvent(RoomEngineTriggerWidgetEvent.REQUEST_PLAYLIST_EDITOR, onRoomEngineObjectEvent);
    UseRoomEngineEvent(RoomEngineTriggerWidgetEvent.OPEN_WIDGET, onRoomEngineObjectEvent);
    UseRoomEngineEvent(RoomEngineTriggerWidgetEvent.CLOSE_WIDGET, onRoomEngineObjectEvent);
    UseRoomEngineEvent(RoomEngineTriggerWidgetEvent.OPEN_FURNI_CONTEXT_MENU, onRoomEngineObjectEvent);
    UseRoomEngineEvent(RoomEngineTriggerWidgetEvent.CLOSE_FURNI_CONTEXT_MENU, onRoomEngineObjectEvent);
    UseRoomEngineEvent(RoomEngineUseProductEvent.USE_PRODUCT_FROM_INVENTORY, onRoomEngineObjectEvent);
    UseRoomEngineEvent(RoomEngineUseProductEvent.USE_PRODUCT_FROM_ROOM, onRoomEngineObjectEvent);
    UseRoomEngineEvent(RoomEngineRoomAdEvent.FURNI_CLICK, onRoomEngineObjectEvent);
    UseRoomEngineEvent(RoomEngineRoomAdEvent.FURNI_DOUBLE_CLICK, onRoomEngineObjectEvent);
    UseRoomEngineEvent(RoomEngineRoomAdEvent.TOOLTIP_SHOW, onRoomEngineObjectEvent);
    UseRoomEngineEvent(RoomEngineRoomAdEvent.TOOLTIP_HIDE, onRoomEngineObjectEvent);

    const onRoomSessionEvent = useCallback((event: RoomSessionEvent) =>
    {
        if(!widgetHandler) return;

        widgetHandler.processEvent(event);
    }, [ widgetHandler ]);

    UseRoomSessionManagerEvent(RoomSessionChatEvent.CHAT_EVENT, onRoomSessionEvent);
    UseRoomSessionManagerEvent(RoomSessionChatEvent.FLOOD_EVENT, onRoomSessionEvent);
    UseRoomSessionManagerEvent(RoomSessionDanceEvent.RSDE_DANCE, onRoomSessionEvent);
    UseRoomSessionManagerEvent(RoomSessionUserBadgesEvent.RSUBE_BADGES, onRoomSessionEvent);
    UseRoomSessionManagerEvent(RoomSessionUserFigureUpdateEvent.USER_FIGURE, onRoomSessionEvent);
    UseRoomSessionManagerEvent(RoomSessionFavoriteGroupUpdateEvent.FAVOURITE_GROUP_UPDATE, onRoomSessionEvent);
    UseRoomSessionManagerEvent(RoomSessionPetStatusUpdateEvent.PET_STATUS_UPDATE, onRoomSessionEvent);
    UseRoomSessionManagerEvent(RoomSessionDimmerPresetsEvent.ROOM_DIMMER_PRESETS, onRoomSessionEvent);
    UseRoomSessionManagerEvent(RoomSessionPetInfoUpdateEvent.PET_INFO, onRoomSessionEvent);
    UseRoomSessionManagerEvent(RoomSessionWordQuizEvent.ANSWERED, onRoomSessionEvent);
    UseRoomSessionManagerEvent(RoomSessionWordQuizEvent.FINISHED, onRoomSessionEvent);
    UseRoomSessionManagerEvent(RoomSessionWordQuizEvent.QUESTION, onRoomSessionEvent);
    UseRoomSessionManagerEvent(RoomSessionPollEvent.OFFER, onRoomSessionEvent);
    UseRoomSessionManagerEvent(RoomSessionPollEvent.ERROR, onRoomSessionEvent);
    UseRoomSessionManagerEvent(RoomSessionPollEvent.CONTENT, onRoomSessionEvent);

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

    UseRoomSessionManagerEvent(RoomSessionErrorMessageEvent.RSEME_KICKED, onRoomSessionErrorMessageEvent);
    UseRoomSessionManagerEvent(RoomSessionErrorMessageEvent.RSEME_PETS_FORBIDDEN_IN_HOTEL, onRoomSessionErrorMessageEvent);
    UseRoomSessionManagerEvent(RoomSessionErrorMessageEvent.RSEME_PETS_FORBIDDEN_IN_FLAT, onRoomSessionErrorMessageEvent);
    UseRoomSessionManagerEvent(RoomSessionErrorMessageEvent.RSEME_MAX_PETS, onRoomSessionErrorMessageEvent);
    UseRoomSessionManagerEvent(RoomSessionErrorMessageEvent.RSEME_MAX_NUMBER_OF_OWN_PETS, onRoomSessionErrorMessageEvent);
    UseRoomSessionManagerEvent(RoomSessionErrorMessageEvent.RSEME_NO_FREE_TILES_FOR_PET, onRoomSessionErrorMessageEvent);
    UseRoomSessionManagerEvent(RoomSessionErrorMessageEvent.RSEME_SELECTED_TILE_NOT_FREE_FOR_PET, onRoomSessionErrorMessageEvent);
    UseRoomSessionManagerEvent(RoomSessionErrorMessageEvent.RSEME_BOTS_FORBIDDEN_IN_HOTEL, onRoomSessionErrorMessageEvent);
    UseRoomSessionManagerEvent(RoomSessionErrorMessageEvent.RSEME_BOTS_FORBIDDEN_IN_FLAT, onRoomSessionErrorMessageEvent);
    UseRoomSessionManagerEvent(RoomSessionErrorMessageEvent.RSEME_BOT_LIMIT_REACHED, onRoomSessionErrorMessageEvent);
    UseRoomSessionManagerEvent(RoomSessionErrorMessageEvent.RSEME_SELECTED_TILE_NOT_FREE_FOR_BOT, onRoomSessionErrorMessageEvent);
    UseRoomSessionManagerEvent(RoomSessionErrorMessageEvent.RSEME_BOT_NAME_NOT_ACCEPTED, onRoomSessionErrorMessageEvent);

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
