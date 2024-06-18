import { GetRoomEngine, RoomEngineObjectEvent, RoomEngineRoomAdEvent, RoomEngineTriggerWidgetEvent, RoomEngineUseProductEvent, RoomId, RoomSessionErrorMessageEvent, RoomZoomEvent } from '@nitrots/nitro-renderer';
import { FC } from 'react';
import { DispatchUiEvent, LocalizeText, NotificationAlertType, RoomWidgetUpdateRoomObjectEvent } from '../../../api';
import { useNitroEvent, useNotification, useRoom } from '../../../hooks';
import { AvatarInfoWidgetView } from './avatar-info/AvatarInfoWidgetView';
import { ChatInputView } from './chat-input/ChatInputView';
import { ChatWidgetView } from './chat/ChatWidgetView';
import { FurniChooserWidgetView } from './choosers/FurniChooserWidgetView';
import { UserChooserWidgetView } from './choosers/UserChooserWidgetView';
import { DoorbellWidgetView } from './doorbell/DoorbellWidgetView';
import { FriendRequestWidgetView } from './friend-request/FriendRequestWidgetView';
import { FurnitureWidgetsView } from './furniture/FurnitureWidgetsView';
import { PetPackageWidgetView } from './pet-package/PetPackageWidgetView';
import { RoomFilterWordsWidgetView } from './room-filter-words/RoomFilterWordsWidgetView';
import { RoomThumbnailWidgetView } from './room-thumbnail/RoomThumbnailWidgetView';
import { RoomToolsWidgetView } from './room-tools/RoomToolsWidgetView';
import { WordQuizWidgetView } from './word-quiz/WordQuizWidgetView';

export const RoomWidgetsView: FC<{}> = props =>
{
    const { roomSession = null } = useRoom();
    const { simpleAlert = null } = useNotification();

    useNitroEvent<RoomZoomEvent>(RoomZoomEvent.ROOM_ZOOM, event => GetRoomEngine().setRoomInstanceRenderingCanvasScale(event.roomId, 1, event.level, null, null, false, event.asDelta));

    useNitroEvent<RoomEngineObjectEvent>(
        [
            RoomEngineTriggerWidgetEvent.REQUEST_TEASER,
            RoomEngineTriggerWidgetEvent.REQUEST_ECOTRONBOX,
            RoomEngineTriggerWidgetEvent.REQUEST_CLOTHING_CHANGE,
            RoomEngineTriggerWidgetEvent.REQUEST_PLAYLIST_EDITOR,
            RoomEngineTriggerWidgetEvent.OPEN_WIDGET,
            RoomEngineTriggerWidgetEvent.CLOSE_WIDGET,
            RoomEngineRoomAdEvent.FURNI_CLICK,
            RoomEngineRoomAdEvent.FURNI_DOUBLE_CLICK,
            RoomEngineRoomAdEvent.TOOLTIP_SHOW,
            RoomEngineRoomAdEvent.TOOLTIP_HIDE,
        ], event =>
        {
            if(!roomSession) return;

            const objectId = event.objectId;
            const category = event.category;

            let updateEvent: RoomWidgetUpdateRoomObjectEvent = null;

            switch(event.type)
            {
                case RoomEngineTriggerWidgetEvent.REQUEST_TEASER:
                    //widgetHandler.processWidgetMessage(new RoomWidgetFurniToWidgetMessage(RoomWidgetFurniToWidgetMessage.REQUEST_TEASER, objectId, category, event.roomId));
                    break;
                case RoomEngineTriggerWidgetEvent.REQUEST_ECOTRONBOX:
                    //widgetHandler.processWidgetMessage(new RoomWidgetFurniToWidgetMessage(RoomWidgetFurniToWidgetMessage.REQUEST_ECOTRONBOX, objectId, category, event.roomId));
                    break;
                case RoomEngineTriggerWidgetEvent.REQUEST_PLACEHOLDER:
                    //widgetHandler.processWidgetMessage(new RoomWidgetFurniToWidgetMessage(RoomWidgetFurniToWidgetMessage.REQUEST_PLACEHOLDER, objectId, category, event.roomId));
                    break;
                case RoomEngineTriggerWidgetEvent.REQUEST_CLOTHING_CHANGE:
                    //widgetHandler.processWidgetMessage(new RoomWidgetFurniToWidgetMessage(RoomWidgetFurniToWidgetMessage.REQUEST_CLOTHING_CHANGE, objectId, category, event.roomId));
                    break;
                case RoomEngineTriggerWidgetEvent.REQUEST_PLAYLIST_EDITOR:
                    //widgetHandler.processWidgetMessage(new RoomWidgetFurniToWidgetMessage(RoomWidgetFurniToWidgetMessage.REQUEST_PLAYLIST_EDITOR, objectId, category, event.roomId));
                    break;
                case RoomEngineTriggerWidgetEvent.OPEN_WIDGET:
                case RoomEngineTriggerWidgetEvent.CLOSE_WIDGET:
                case RoomEngineUseProductEvent.USE_PRODUCT_FROM_ROOM:
                    //widgetHandler.processEvent(event);
                    break;
                case RoomEngineRoomAdEvent.FURNI_CLICK:
                case RoomEngineRoomAdEvent.FURNI_DOUBLE_CLICK:
                    //handleRoomAdClick(event);
                    break;
                case RoomEngineRoomAdEvent.TOOLTIP_SHOW:
                case RoomEngineRoomAdEvent.TOOLTIP_HIDE:
                    //handleRoomAdTooltip(event);
                    break;
            }

            if(!updateEvent) return;

            let dispatchEvent = true;

            if(RoomId.isRoomPreviewerId(updateEvent.roomId)) return;

            if(updateEvent instanceof RoomWidgetUpdateRoomObjectEvent) dispatchEvent = (!RoomId.isRoomPreviewerId(updateEvent.roomId));

            if(dispatchEvent) DispatchUiEvent(updateEvent);
        });

    useNitroEvent<RoomSessionErrorMessageEvent>(
        [
            RoomSessionErrorMessageEvent.RSEME_KICKED,
            RoomSessionErrorMessageEvent.RSEME_PETS_FORBIDDEN_IN_HOTEL,
            RoomSessionErrorMessageEvent.RSEME_PETS_FORBIDDEN_IN_FLAT,
            RoomSessionErrorMessageEvent.RSEME_MAX_PETS,
            RoomSessionErrorMessageEvent.RSEME_MAX_NUMBER_OF_OWN_PETS,
            RoomSessionErrorMessageEvent.RSEME_NO_FREE_TILES_FOR_PET,
            RoomSessionErrorMessageEvent.RSEME_SELECTED_TILE_NOT_FREE_FOR_PET,
            RoomSessionErrorMessageEvent.RSEME_BOTS_FORBIDDEN_IN_HOTEL,
            RoomSessionErrorMessageEvent.RSEME_BOTS_FORBIDDEN_IN_FLAT,
            RoomSessionErrorMessageEvent.RSEME_BOT_LIMIT_REACHED,
            RoomSessionErrorMessageEvent.RSEME_SELECTED_TILE_NOT_FREE_FOR_BOT,
            RoomSessionErrorMessageEvent.RSEME_BOT_NAME_NOT_ACCEPTED,
        ], event =>
        {
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

            simpleAlert(errorMessage, NotificationAlertType.DEFAULT, null, null, errorTitle);
        });

    return (
        <>
            <div className="absolute top-0 left-0 pointer-events-none size-full">
                <FurnitureWidgetsView />
            </div>
            <AvatarInfoWidgetView />
            <ChatWidgetView />
            <ChatInputView />
            <DoorbellWidgetView />
            <RoomToolsWidgetView />
            <RoomFilterWordsWidgetView />
            <RoomThumbnailWidgetView />
            <FurniChooserWidgetView />
            <PetPackageWidgetView />
            <UserChooserWidgetView />
            <WordQuizWidgetView />
            <FriendRequestWidgetView />
        </>
    );
};
