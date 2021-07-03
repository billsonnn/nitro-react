import { RoomSessionChatEvent, RoomSessionDanceEvent, RoomSessionDimmerPresetsEvent, RoomSessionDoorbellEvent, RoomSessionErrorMessageEvent, RoomSessionEvent, RoomSessionFriendRequestEvent, RoomSessionPetInfoUpdateEvent, RoomSessionPresentEvent, RoomSessionUserBadgesEvent } from 'nitro-renderer';
import { FC, useCallback } from 'react';
import { useRoomSessionManagerEvent } from '../../../hooks/events';
import { LocalizeText } from '../../../utils/LocalizeText';
import { useRoomContext } from '../context/RoomContext';
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
    const { eventDispatcher = null, widgetHandler = null } = useRoomContext();

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

    const onRoomErrorEvent = useCallback((event: RoomSessionEvent) =>
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

    useRoomSessionManagerEvent(RoomSessionErrorMessageEvent.RSEME_KICKED, onRoomErrorEvent);
    useRoomSessionManagerEvent(RoomSessionErrorMessageEvent.RSEME_PETS_FORBIDDEN_IN_HOTEL, onRoomErrorEvent);
    useRoomSessionManagerEvent(RoomSessionErrorMessageEvent.RSEME_PETS_FORBIDDEN_IN_FLAT, onRoomErrorEvent);
    useRoomSessionManagerEvent(RoomSessionErrorMessageEvent.RSEME_MAX_PETS, onRoomErrorEvent);
    useRoomSessionManagerEvent(RoomSessionErrorMessageEvent.RSEME_MAX_NUMBER_OF_OWN_PETS, onRoomErrorEvent);
    useRoomSessionManagerEvent(RoomSessionErrorMessageEvent.RSEME_NO_FREE_TILES_FOR_PET, onRoomErrorEvent);
    useRoomSessionManagerEvent(RoomSessionErrorMessageEvent.RSEME_SELECTED_TILE_NOT_FREE_FOR_PET, onRoomErrorEvent);
    useRoomSessionManagerEvent(RoomSessionErrorMessageEvent.RSEME_BOTS_FORBIDDEN_IN_HOTEL, onRoomErrorEvent);
    useRoomSessionManagerEvent(RoomSessionErrorMessageEvent.RSEME_BOTS_FORBIDDEN_IN_FLAT, onRoomErrorEvent);
    useRoomSessionManagerEvent(RoomSessionErrorMessageEvent.RSEME_BOT_LIMIT_REACHED, onRoomErrorEvent);
    useRoomSessionManagerEvent(RoomSessionErrorMessageEvent.RSEME_SELECTED_TILE_NOT_FREE_FOR_BOT, onRoomErrorEvent);
    useRoomSessionManagerEvent(RoomSessionErrorMessageEvent.RSEME_BOT_NAME_NOT_ACCEPTED, onRoomErrorEvent);

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
