import { GenericErrorEvent, NavigatorCategoriesComposer, NavigatorMetadataEvent, NavigatorSearchEvent, NavigatorSettingsComposer, RoomDataParser, RoomDoorbellAcceptedEvent, RoomDoorbellEvent, RoomForwardEvent, RoomInfoComposer, RoomInfoEvent, RoomInfoOwnerEvent, UserInfoEvent } from 'nitro-renderer';
import { useCallback } from 'react';
import { GetRoomSessionManager, GetSessionDataManager } from '../../api';
import { CreateMessageHook, SendMessageHook } from '../../hooks/messages/message-event';
import { NavigatorLockViewStage } from './lock/NavigatorLockView.types';
import { NavigatorMessageHandlerProps } from './NavigatorMessageHandler.types';

export function NavigatorMessageHandler(props: NavigatorMessageHandlerProps): JSX.Element
{
    const { setTopLevelContext = null, setTopLevelContexts = null, setSearchResults = null, showLock = null, hideLock = null } = props;

    const onUserInfoEvent = useCallback((event: UserInfoEvent) =>
    {
        const parser = event.getParser();

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
                        showLock();
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
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        if(!parser.userName || (parser.userName.length === 0))
        {
            showLock(NavigatorLockViewStage.WAITING);
        }
    }, []);

    const onRoomDoorbellAcceptedEvent = useCallback((event: RoomDoorbellAcceptedEvent) =>
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        if(!parser.userName || (parser.userName.length === 0))
        {
            hideLock();
        }
    }, []);

    const onGenericErrorEvent = useCallback((event: GenericErrorEvent) =>
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        switch(parser.errorCode)
        {
            case -100002:
                showLock(NavigatorLockViewStage.FAILED);
                break;
        }
    }, []);

    const onNavigatorMetadataEvent = useCallback((event: NavigatorMetadataEvent) =>
    {
        const parser = event.getParser();

        setTopLevelContexts(parser.topLevelContexts);

        if(parser.topLevelContexts.length > 0) setTopLevelContext(parser.topLevelContexts[0]);

        // clear search
    }, [ setTopLevelContext, setTopLevelContexts ]);

    const onNavigatorSearchEvent = useCallback((event: NavigatorSearchEvent) =>
    {
        const parser = event.getParser();

        setSearchResults(parser.result.results);
    }, [ setSearchResults ]);

    CreateMessageHook(UserInfoEvent, onUserInfoEvent);
    CreateMessageHook(RoomForwardEvent, onRoomForwardEvent);
    CreateMessageHook(RoomInfoOwnerEvent, onRoomInfoOwnerEvent);
    CreateMessageHook(RoomInfoEvent, onRoomInfoEvent);
    CreateMessageHook(RoomDoorbellEvent, onRoomDoorbellEvent);
    CreateMessageHook(RoomDoorbellAcceptedEvent, onRoomDoorbellAcceptedEvent);
    CreateMessageHook(GenericErrorEvent, onGenericErrorEvent);
    CreateMessageHook(NavigatorMetadataEvent, onNavigatorMetadataEvent);
    CreateMessageHook(NavigatorSearchEvent, onNavigatorSearchEvent);

    return null;
}
