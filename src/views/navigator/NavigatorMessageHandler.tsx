import { GenericErrorEvent, GetGuestRoomResultEvent, NavigatorCategoriesComposer, NavigatorCategoriesEvent, NavigatorHomeRoomEvent, NavigatorMetadataEvent, NavigatorSearchEvent, NavigatorSettingsComposer, RoomCreatedEvent, RoomDataParser, RoomDoorbellAcceptedEvent, RoomDoorbellEvent, RoomDoorbellRejectedEvent, RoomEntryInfoMessageEvent, RoomForwardEvent, RoomInfoComposer, RoomSettingsUpdatedEvent, UserInfoEvent } from '@nitrots/nitro-renderer';
import { FC, useCallback } from 'react';
import { CreateRoomSession, GetSessionDataManager } from '../../api';
import { UpdateDoorStateEvent } from '../../events';
import { dispatchUiEvent } from '../../hooks';
import { CreateMessageHook, SendMessageHook } from '../../hooks/messages/message-event';
import { useNavigatorContext } from './context/NavigatorContext';
import { NavigatorMessageHandlerProps } from './NavigatorMessageHandler.types';
import { NavigatorActions } from './reducers/NavigatorReducer';

export const NavigatorMessageHandler: FC<NavigatorMessageHandlerProps> = props =>
{
    const { navigatorState = null, dispatchNavigatorState = null } = useNavigatorContext();

    const onUserInfoEvent = useCallback((event: UserInfoEvent) =>
    {
        SendMessageHook(new NavigatorCategoriesComposer());
        SendMessageHook(new NavigatorSettingsComposer());
    }, []);

    const onRoomForwardEvent = useCallback((event: RoomForwardEvent) =>
    {
        const parser = event.getParser();

        SendMessageHook(new RoomInfoComposer(parser.roomId, false, true));
    }, []);

    const onRoomEntryInfoMessageEvent = useCallback((event: RoomEntryInfoMessageEvent) =>
    {
        const parser = event.getParser();

        const roomInfoData = navigatorState.roomInfoData;
        roomInfoData.currentRoomOwner = parser.isOwner;
        roomInfoData.currentRoomId = parser.roomId;

        dispatchNavigatorState({
            type: NavigatorActions.SET_ROOM_INFO_DATA,
            payload: {
                roomInfoData: roomInfoData
            }
        });

        SendMessageHook(new RoomInfoComposer(parser.roomId, true, false));
    }, [ navigatorState, dispatchNavigatorState ]);

    const onGetGuestRoomResultEvent = useCallback((event: GetGuestRoomResultEvent) =>
    {
        const parser = event.getParser();

        if(parser.roomEnter)
        {
            const roomInfoData = navigatorState.roomInfoData;
            roomInfoData.enteredGuestRoom = parser.data;

            dispatchNavigatorState({
                type: NavigatorActions.SET_ROOM_INFO_DATA,
                payload: {
                    roomInfoData: roomInfoData
                }
            });
        }
        else if(parser.roomForward)
        {
            if((parser.data.ownerName !== GetSessionDataManager().userName) && !parser.isGroupMember)
            {
                switch(parser.data.doorMode)
                {
                    case RoomDataParser.DOORBELL_STATE:
                        dispatchUiEvent(new UpdateDoorStateEvent(UpdateDoorStateEvent.START_DOORBELL, parser.data));
                        return;
                    case RoomDataParser.PASSWORD_STATE:
                        dispatchUiEvent(new UpdateDoorStateEvent(UpdateDoorStateEvent.START_PASSWORD, parser.data));
                        return;
                }
            }

            CreateRoomSession(parser.data.roomId);
        }
        else
        {
            const roomInfoData = navigatorState.roomInfoData;
            roomInfoData.enteredGuestRoom = parser.data;

            dispatchNavigatorState({
                type: NavigatorActions.SET_ROOM_INFO_DATA,
                payload: {
                    roomInfoData: roomInfoData
                }
            });
        }
    }, [ dispatchNavigatorState, navigatorState ]);

    const onRoomDoorbellEvent = useCallback((event: RoomDoorbellEvent) =>
    {
        const parser = event.getParser();

        if(!parser.userName || (parser.userName.length === 0))
        {
            dispatchUiEvent(new UpdateDoorStateEvent(UpdateDoorStateEvent.STATE_WAITING));
        }
    }, []);

    const onRoomDoorbellAcceptedEvent = useCallback((event: RoomDoorbellAcceptedEvent) =>
    {
        const parser = event.getParser();

        if(!parser.userName || (parser.userName.length === 0))
        {
            dispatchUiEvent(new UpdateDoorStateEvent(UpdateDoorStateEvent.STATE_ACCEPTED));
        }
    }, []);

    const onRoomDoorbellRejectedEvent = useCallback((event: RoomDoorbellRejectedEvent) =>
    {
        const parser = event.getParser();

        if(!parser.userName || (parser.userName.length === 0))
        {
            dispatchUiEvent(new UpdateDoorStateEvent(UpdateDoorStateEvent.STATE_NO_ANSWER));
        }
    }, []);

    const onGenericErrorEvent = useCallback((event: GenericErrorEvent) =>
    {
        const parser = event.getParser();

        switch(parser.errorCode)
        {
            case -100002:
                dispatchUiEvent(new UpdateDoorStateEvent(UpdateDoorStateEvent.STATE_WRONG_PASSWORD));
                break;
        }
    }, []);

    const onNavigatorMetadataEvent = useCallback((event: NavigatorMetadataEvent) =>
    {
        const parser = event.getParser();

        dispatchNavigatorState({
            type: NavigatorActions.SET_TOP_LEVEL_CONTEXTS,
            payload: {
                topLevelContexts: parser.topLevelContexts
            }
        });
    }, [ dispatchNavigatorState ]);

    const onNavigatorSearchEvent = useCallback((event: NavigatorSearchEvent) =>
    {
        const parser = event.getParser();

        dispatchNavigatorState({
            type: NavigatorActions.SET_SEARCH_RESULT,
            payload: {
                searchResult: parser.result
            }
        });
    }, [ dispatchNavigatorState ]);

    const onNavigatorCategoriesEvent = useCallback((event: NavigatorCategoriesEvent) =>
    {
        const parser = event.getParser();

        dispatchNavigatorState({
            type: NavigatorActions.SET_CATEGORIES,
            payload: {
                categories: parser.categories
            }
        });
    }, [ dispatchNavigatorState ]);

    const onRoomCreatedEvent = useCallback((event: RoomCreatedEvent) =>
    {
        const parser = event.getParser();

        CreateRoomSession(parser.roomId);
    }, []);

    const onNavigatorHomeRoomEvent = useCallback((event: NavigatorHomeRoomEvent) =>
    {
        const parser = event.getParser();

        dispatchNavigatorState({
            type: NavigatorActions.SET_HOME_ROOM_ID,
            payload: {
                homeRoomId: parser.homeRoomId
            }
        });
    }, [ dispatchNavigatorState ]);

    const onRoomSettingsUpdatedEvent = useCallback((event: RoomSettingsUpdatedEvent) =>
    {
        const parser = event.getParser();

        SendMessageHook(new RoomInfoComposer(parser.roomId, false, false));
    }, []);

    CreateMessageHook(UserInfoEvent, onUserInfoEvent);
    CreateMessageHook(RoomForwardEvent, onRoomForwardEvent);
    CreateMessageHook(RoomEntryInfoMessageEvent, onRoomEntryInfoMessageEvent);
    CreateMessageHook(GetGuestRoomResultEvent, onGetGuestRoomResultEvent);
    CreateMessageHook(RoomDoorbellEvent, onRoomDoorbellEvent);
    CreateMessageHook(RoomDoorbellAcceptedEvent, onRoomDoorbellAcceptedEvent);
    CreateMessageHook(RoomDoorbellRejectedEvent, onRoomDoorbellRejectedEvent);
    CreateMessageHook(GenericErrorEvent, onGenericErrorEvent);
    CreateMessageHook(NavigatorMetadataEvent, onNavigatorMetadataEvent);
    CreateMessageHook(NavigatorSearchEvent, onNavigatorSearchEvent);
    CreateMessageHook(NavigatorCategoriesEvent, onNavigatorCategoriesEvent);
    CreateMessageHook(RoomCreatedEvent, onRoomCreatedEvent);
    CreateMessageHook(NavigatorHomeRoomEvent, onNavigatorHomeRoomEvent);
    CreateMessageHook(RoomSettingsUpdatedEvent, onRoomSettingsUpdatedEvent);

    return null;
}
