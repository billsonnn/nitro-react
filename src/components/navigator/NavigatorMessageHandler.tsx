import { CantConnectMessageParser, GenericErrorEvent, GetGuestRoomResultEvent, LegacyExternalInterface, NavigatorCategoriesComposer, NavigatorCategoriesEvent, NavigatorHomeRoomEvent, NavigatorMetadataEvent, NavigatorOpenRoomCreatorEvent, NavigatorSearchEvent, NavigatorSettingsComposer, RoomCreatedEvent, RoomDataParser, RoomDoorbellAcceptedEvent, RoomDoorbellEvent, RoomDoorbellRejectedEvent, RoomEnterErrorEvent, RoomEntryInfoMessageEvent, RoomForwardEvent, RoomInfoComposer, RoomSettingsUpdatedEvent, UserInfoEvent } from '@nitrots/nitro-renderer';
import { FC, useCallback } from 'react';
import { CreateRoomSession, GetSessionDataManager, LocalizeText, NotificationAlertType, NotificationUtilities, SendMessageComposer, VisitDesktop } from '../../api';
import { NavigatorEvent, UpdateDoorStateEvent } from '../../events';
import { DispatchUiEvent, UseMessageEventHook } from '../../hooks';
import { useNavigatorContext } from './NavigatorContext';
import { NavigatorActions } from './reducers/NavigatorReducer';

export const NavigatorMessageHandler: FC<{}> = props =>
{
    const { navigatorState = null, dispatchNavigatorState = null } = useNavigatorContext();

    const onUserInfoEvent = useCallback((event: UserInfoEvent) =>
    {
        SendMessageComposer(new NavigatorCategoriesComposer());
        SendMessageComposer(new NavigatorSettingsComposer());
    }, []);

    const onRoomForwardEvent = useCallback((event: RoomForwardEvent) =>
    {
        const parser = event.getParser();

        SendMessageComposer(new RoomInfoComposer(parser.roomId, false, true));
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

        SendMessageComposer(new RoomInfoComposer(parser.roomId, true, false));

        if(LegacyExternalInterface.available) LegacyExternalInterface.call('legacyTrack', 'navigator', 'private', [ parser.roomId ]);
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
                        DispatchUiEvent(new UpdateDoorStateEvent(UpdateDoorStateEvent.START_DOORBELL, parser.data));
                        return;
                    case RoomDataParser.PASSWORD_STATE:
                        DispatchUiEvent(new UpdateDoorStateEvent(UpdateDoorStateEvent.START_PASSWORD, parser.data));
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
            DispatchUiEvent(new UpdateDoorStateEvent(UpdateDoorStateEvent.STATE_WAITING));
        }
    }, []);

    const onRoomDoorbellAcceptedEvent = useCallback((event: RoomDoorbellAcceptedEvent) =>
    {
        const parser = event.getParser();

        if(!parser.userName || (parser.userName.length === 0))
        {
            DispatchUiEvent(new UpdateDoorStateEvent(UpdateDoorStateEvent.STATE_ACCEPTED));
        }
    }, []);

    const onRoomDoorbellRejectedEvent = useCallback((event: RoomDoorbellRejectedEvent) =>
    {
        const parser = event.getParser();

        if(!parser.userName || (parser.userName.length === 0))
        {
            DispatchUiEvent(new UpdateDoorStateEvent(UpdateDoorStateEvent.STATE_NO_ANSWER));
        }
    }, []);

    const onGenericErrorEvent = useCallback((event: GenericErrorEvent) =>
    {
        const parser = event.getParser();

        switch(parser.errorCode)
        {
            case -100002:
                DispatchUiEvent(new UpdateDoorStateEvent(UpdateDoorStateEvent.STATE_WRONG_PASSWORD));
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

        SendMessageComposer(new RoomInfoComposer(parser.roomId, false, false));
    }, []);

    const onRoomEnterErrorEvent = useCallback((event: RoomEnterErrorEvent) =>
    {
        const parser = event.getParser();

        switch(parser.reason)
        {
            case CantConnectMessageParser.REASON_FULL:
                NotificationUtilities.simpleAlert(LocalizeText('navigator.guestroomfull.text'), NotificationAlertType.DEFAULT, null, null, LocalizeText('navigator.guestroomfull.title'));

                break;
            case CantConnectMessageParser.REASON_QUEUE_ERROR:
                NotificationUtilities.simpleAlert(LocalizeText(`room.queue.error.${ parser.parameter }`), NotificationAlertType.DEFAULT, null, null, LocalizeText('room.queue.error.title'));

                break;
            case CantConnectMessageParser.REASON_BANNED:
                NotificationUtilities.simpleAlert(LocalizeText('navigator.banned.text'), NotificationAlertType.DEFAULT, null, null, LocalizeText('navigator.banned.title'));

                break;
            default:
                NotificationUtilities.simpleAlert(LocalizeText('room.queue.error.title'), NotificationAlertType.DEFAULT, null, null, LocalizeText('room.queue.error.title'));

                break;
        }

        VisitDesktop();
    }, []);

    const onRoomCreatorEvent = useCallback((event: RoomEnterErrorEvent) =>
    {
        DispatchUiEvent(new NavigatorEvent(NavigatorEvent.SHOW_ROOM_CREATOR));
    },[]);

    UseMessageEventHook(UserInfoEvent, onUserInfoEvent);
    UseMessageEventHook(RoomForwardEvent, onRoomForwardEvent);
    UseMessageEventHook(RoomEntryInfoMessageEvent, onRoomEntryInfoMessageEvent);
    UseMessageEventHook(GetGuestRoomResultEvent, onGetGuestRoomResultEvent);
    UseMessageEventHook(RoomDoorbellEvent, onRoomDoorbellEvent);
    UseMessageEventHook(RoomDoorbellAcceptedEvent, onRoomDoorbellAcceptedEvent);
    UseMessageEventHook(RoomDoorbellRejectedEvent, onRoomDoorbellRejectedEvent);
    UseMessageEventHook(GenericErrorEvent, onGenericErrorEvent);
    UseMessageEventHook(NavigatorMetadataEvent, onNavigatorMetadataEvent);
    UseMessageEventHook(NavigatorSearchEvent, onNavigatorSearchEvent);
    UseMessageEventHook(NavigatorCategoriesEvent, onNavigatorCategoriesEvent);
    UseMessageEventHook(RoomCreatedEvent, onRoomCreatedEvent);
    UseMessageEventHook(NavigatorHomeRoomEvent, onNavigatorHomeRoomEvent);
    UseMessageEventHook(RoomSettingsUpdatedEvent, onRoomSettingsUpdatedEvent);
    UseMessageEventHook(RoomEnterErrorEvent, onRoomEnterErrorEvent);
    UseMessageEventHook(NavigatorOpenRoomCreatorEvent, onRoomCreatorEvent);

    return null;
}
