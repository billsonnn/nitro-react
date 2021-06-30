import { GenericErrorEvent, NavigatorCategoriesComposer, NavigatorCategoriesEvent, NavigatorMetadataEvent, NavigatorSearchEvent, NavigatorSettingsComposer, RoomCreatedEvent, RoomDataParser, RoomDoorbellAcceptedEvent, RoomDoorbellEvent, RoomForwardEvent, RoomInfoComposer, RoomInfoEvent, RoomInfoOwnerEvent, UserInfoEvent } from 'nitro-renderer';
import { FC, useCallback } from 'react';
import { GetRoomSessionManager, GetSessionDataManager } from '../../api';
import { VisitRoom } from '../../api/navigator/VisitRoom';
import { CreateMessageHook, SendMessageHook } from '../../hooks/messages/message-event';
import { useNavigatorContext } from './context/NavigatorContext';
import { NavigatorMessageHandlerProps } from './NavigatorMessageHandler.types';
import { NavigatorActions } from './reducers/NavigatorReducer';

export const NavigatorMessageHandler: FC<NavigatorMessageHandlerProps> = props =>
{
    const { dispatchNavigatorState = null } = useNavigatorContext();

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

    const onRoomInfoOwnerEvent = useCallback((event: RoomInfoOwnerEvent) =>
    {
        const parser = event.getParser();

        SendMessageHook(new RoomInfoComposer(parser.roomId, true, false));
    }, []);

    const onRoomInfoEvent = useCallback((event: RoomInfoEvent) =>
    {
        const parser = event.getParser();

        if(parser.roomEnter)
        {
            // this._data.enteredGuestRoom = parser.data;
            // this._data.staffPick        = parser.data.roomPicker;

            // const isCreatedRoom = (this._data.createdRoomId === parser.data.roomId);

            // if(!isCreatedRoom && parser.data.displayRoomEntryAd)
            // {
            //     // display ad
            // }

            // this._data.createdRoomId = 0;
        }
        else if(parser.roomForward)
        {
            if((parser.data.ownerName !== GetSessionDataManager().userName) && !parser.isGroupMember)
            {
                switch(parser.data.doorMode)
                {
                    case RoomDataParser.DOORBELL_STATE:
                    case RoomDataParser.PASSWORD_STATE:
                        //showLock();
                        return;
                }
            }

            GetRoomSessionManager().createSession(parser.data.roomId);
        }
        else
        {
            // this._data.enteredGuestRoom = parser.data;
            // this._data.staffPick        = parser.data.roomPicker;
        }
    }, []);

    const onRoomDoorbellEvent = useCallback((event: RoomDoorbellEvent) =>
    {
        const parser = event.getParser();

        // if(!parser.userName || (parser.userName.length === 0))
        // {
        //     showLock(NavigatorLockViewStage.WAITING);
        // }
    }, []);

    const onRoomDoorbellAcceptedEvent = useCallback((event: RoomDoorbellAcceptedEvent) =>
    {
        const parser = event.getParser();

        // if(!parser.userName || (parser.userName.length === 0))
        // {
        //     hideLock();
        // }
    }, []);

    const onGenericErrorEvent = useCallback((event: GenericErrorEvent) =>
    {
        const parser = event.getParser();

        // switch(parser.errorCode)
        // {
        //     case -100002:
        //         showLock(NavigatorLockViewStage.FAILED);
        //         break;
        // }
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

        VisitRoom(parser.roomId);
    }, []);

    CreateMessageHook(UserInfoEvent, onUserInfoEvent);
    CreateMessageHook(RoomForwardEvent, onRoomForwardEvent);
    CreateMessageHook(RoomInfoOwnerEvent, onRoomInfoOwnerEvent);
    CreateMessageHook(RoomInfoEvent, onRoomInfoEvent);
    CreateMessageHook(RoomDoorbellEvent, onRoomDoorbellEvent);
    CreateMessageHook(RoomDoorbellAcceptedEvent, onRoomDoorbellAcceptedEvent);
    CreateMessageHook(GenericErrorEvent, onGenericErrorEvent);
    CreateMessageHook(NavigatorMetadataEvent, onNavigatorMetadataEvent);
    CreateMessageHook(NavigatorSearchEvent, onNavigatorSearchEvent);
    CreateMessageHook(NavigatorCategoriesEvent, onNavigatorCategoriesEvent);
    CreateMessageHook(RoomCreatedEvent, onRoomCreatedEvent);

    return null;
}
