import { NavigatorCategoriesComposer, NavigatorInitComposer, NavigatorMetadataEvent, NavigatorSearchComposer, NavigatorSettingsComposer, NavigatorTopLevelContext, RoomDataParser, RoomForwardEvent, RoomInfoComposer, RoomInfoEvent, RoomInfoOwnerEvent, RoomSessionEvent, UserInfoEvent } from 'nitro-renderer';
import { MouseEvent, useCallback, useEffect, useState } from 'react';
import { GetRoomSessionManager, GetSessionDataManager } from '../../api';
import { NavigatorEvent } from '../../events';
import { DraggableWindow } from '../../hooks/draggable-window/DraggableWindow';
import { useRoomSessionManagerEvent } from '../../hooks/events/nitro/session/room-session-manager-event';
import { useUiEvent } from '../../hooks/events/ui/ui-event';
import { CreateMessageHook, SendMessageHook } from '../../hooks/messages/message-event';
import { LocalizeText } from '../../utils/LocalizeText';
import { NavigatorViewProps } from './NavigatorView.types';
import { NavigatorTabsView } from './tabs/NavigatorTabsView';

export function NavigatorView(props: NavigatorViewProps): JSX.Element
{
    const [ isVisible, setIsVisible ]   = useState(false);
    const [ isLoaded, setIsLoaded ]     = useState(false);
    const [ isLoading, setIsLoading ]   = useState(false);
    const [ isSearching, setIsSearching ] = useState(false);

    const [ topLevelContexts, setTopLevelContexts ] = useState<NavigatorTopLevelContext[]>(null);
    const [ topLevelContext, setTopLevelContext ] = useState<NavigatorTopLevelContext>(null);

    function hideNavigator(event: MouseEvent = null): void
    {
        if(event) event.preventDefault();

        setIsVisible(false);
    }

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
                        console.log('open doorbell');
                        return;
                    case RoomDataParser.PASSWORD_STATE:
                        console.log('open password');
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

    const onNavigatorMetadataEvent = useCallback((event: NavigatorMetadataEvent) =>
    {
        const parser = event.getParser();

        setTopLevelContexts(parser.topLevelContexts);

        if(parser.topLevelContexts.length > 0) setTopLevelContext(parser.topLevelContexts[0]);

        // clear search
    }, []);

    const onNavigatorEvent = useCallback((event: NavigatorEvent) =>
    {
        switch(event.type)
        {
            case NavigatorEvent.SHOW_NAVIGATOR:
                setIsVisible(true);
                return;
            case NavigatorEvent.TOGGLE_NAVIGATOR:
                setIsVisible(value => !value);
                return;
        }
    }, []);

    const onRoomSessionEvent = useCallback((event: RoomSessionEvent) =>
    {
        switch(event.type)
        {
            case RoomSessionEvent.CREATED:
                setIsVisible(false);
                return;
        }
    }, []);

    const search = useCallback((value: string = null) =>
    {
        if(!topLevelContext) return;

        sendSearch(topLevelContext.code, '');
    }, [ topLevelContext ]);

    function sendSearch(code: string, query: string): void
    {
        SendMessageHook(new NavigatorSearchComposer(code, query));
    }

    useEffect(() =>
    {
        if(!isVisible) return;
        
        if(!isLoaded)
        {
            SendMessageHook(new NavigatorInitComposer());

            setIsLoaded(true);
        }
        else
        {
            search();
        }
    }, [ isVisible, isLoaded, search ]);

    useUiEvent(NavigatorEvent.SHOW_NAVIGATOR, onNavigatorEvent);
    useUiEvent(NavigatorEvent.TOGGLE_NAVIGATOR, onNavigatorEvent);

    useRoomSessionManagerEvent(RoomSessionEvent.CREATED, onRoomSessionEvent);

    CreateMessageHook(new UserInfoEvent(onUserInfoEvent));
    CreateMessageHook(new RoomForwardEvent(onRoomForwardEvent));
    CreateMessageHook(new RoomInfoOwnerEvent(onRoomInfoOwnerEvent));
    CreateMessageHook(new RoomInfoEvent(onRoomInfoEvent));
    CreateMessageHook(new NavigatorMetadataEvent(onNavigatorMetadataEvent));

    if(!isVisible) return null;
    
    return (
        <DraggableWindow handle=".drag-handler">
            <div className="nitro-navigator d-flex flex-column bg-primary border border-black shadow rounded">
                <div className="drag-handler d-flex justify-content-between align-items-center px-3 pt-3">
                    <div className="h6 m-0">{ LocalizeText(isLoading ? 'navigator.title.is.busy' : 'navigator.title') }</div>
                    <button type="button" className="close" onClick={ hideNavigator }>
                        <i className="fas fa-times"></i>
                    </button>
                </div>
                <NavigatorTabsView topLevelContext={ topLevelContext } topLevelContexts={ topLevelContexts } setTopLevelContext={ setTopLevelContext } />
            </div>
        </DraggableWindow>
    );
}
