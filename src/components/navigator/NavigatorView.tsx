import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ConvertGlobalRoomIdMessageComposer, HabboWebTools, ILinkEventTracker, LegacyExternalInterface, NavigatorInitComposer, NavigatorSearchComposer, RoomDataParser, RoomSessionEvent } from '@nitrots/nitro-renderer';
import { FC, useCallback, useEffect, useMemo, useReducer, useState } from 'react';
import { AddEventLinkTracker, GoToDesktop, LocalizeText, RemoveLinkEventTracker, TryVisitRoom } from '../../api';
import { Column } from '../../common/Column';
import { NavigatorEvent, UpdateDoorStateEvent } from '../../events';
import { UseMountEffect } from '../../hooks';
import { useRoomSessionManagerEvent } from '../../hooks/events/nitro/session/room-session-manager-event';
import { useUiEvent } from '../../hooks/events/ui/ui-event';
import { SendMessageHook } from '../../hooks/messages/message-event';
import { NitroCardContentView, NitroCardHeaderView, NitroCardTabsItemView, NitroCardTabsView, NitroCardView } from '../../layout';
import { NavigatorContextProvider } from './NavigatorContext';
import { NavigatorMessageHandler } from './NavigatorMessageHandler';
import { initialNavigator, NavigatorActions, NavigatorReducer } from './reducers/NavigatorReducer';
import { NavigatorRoomCreatorView } from './views/creator/NavigatorRoomCreatorView';
import { NavigatorRoomDoorbellView } from './views/room-doorbell/NavigatorRoomDoorbellView';
import { NavigatorRoomInfoView } from './views/room-info/NavigatorRoomInfoView';
import { NavigatorRoomLinkView } from './views/room-link/NavigatorRoomLinkView';
import { NavigatorRoomPasswordView } from './views/room-password/NavigatorRoomPasswordView';
import { NavigatorRoomSettingsView } from './views/room-settings/NavigatorRoomSettingsView';
import { NavigatorSearchResultView } from './views/search-result/NavigatorSearchResultView';
import { NavigatorSearchView } from './views/search/NavigatorSearchView';

export const NavigatorView: FC<{}> = props =>
{
    const [ isVisible, setIsVisible ] = useState(false);
    const [ isCreatorOpen, setCreatorOpen ] = useState(false);
    const [ isRoomInfoOpen, setRoomInfoOpen ] = useState(false);
    const [ isRoomLinkOpen, setRoomLinkOpen ] = useState(false);
    const [ pendingDoorState, setPendingDoorState ] = useState<{ roomData: RoomDataParser, state: string }>(null);
    const [ navigatorState, dispatchNavigatorState ] = useReducer(NavigatorReducer, initialNavigator);
    const { needsNavigatorUpdate = false, topLevelContext = null, topLevelContexts = null, homeRoomId } = navigatorState;

    const onNavigatorEvent = useCallback((event: NavigatorEvent) =>
    {
        switch(event.type)
        {
            case NavigatorEvent.SHOW_NAVIGATOR:
                setIsVisible(true);
                return;
            case NavigatorEvent.HIDE_NAVIGATOR:
                setIsVisible(false);
                return;
            case NavigatorEvent.TOGGLE_NAVIGATOR:
                setIsVisible(value => !value);
                return;
            case NavigatorEvent.TOGGLE_ROOM_INFO:
                setRoomInfoOpen(value => !value);
                return;
            case NavigatorEvent.TOGGLE_ROOM_LINK:
                setRoomLinkOpen(value => !value);
                return;
        }
    }, []);

    useUiEvent(NavigatorEvent.SHOW_NAVIGATOR, onNavigatorEvent);
    useUiEvent(NavigatorEvent.HIDE_NAVIGATOR, onNavigatorEvent);
    useUiEvent(NavigatorEvent.TOGGLE_NAVIGATOR, onNavigatorEvent);
    useUiEvent(NavigatorEvent.TOGGLE_ROOM_INFO, onNavigatorEvent);
    useUiEvent(NavigatorEvent.TOGGLE_ROOM_LINK, onNavigatorEvent);

    const onUpdateDoorStateEvent = useCallback((event: UpdateDoorStateEvent) =>
    {
        switch(event.type)
        {
            case UpdateDoorStateEvent.START_DOORBELL:
                setPendingDoorState({ roomData: event.roomData, state: event.type });
                return;
            case UpdateDoorStateEvent.START_PASSWORD:
                setPendingDoorState({ roomData: event.roomData, state: event.type });
                return;
            case UpdateDoorStateEvent.STATE_WAITING:
                setPendingDoorState(prevValue =>
                    {
                        return { roomData: prevValue.roomData, state: event.type }
                    });
                return;
            case UpdateDoorStateEvent.STATE_NO_ANSWER:
                setPendingDoorState(prevValue =>
                    {
                        if(prevValue.state === UpdateDoorStateEvent.STATE_WAITING) GoToDesktop();

                        return { roomData: prevValue.roomData, state: event.type }
                    });
                return;
            case UpdateDoorStateEvent.STATE_WRONG_PASSWORD:
                setPendingDoorState(prevValue =>
                    {
                        return { roomData: prevValue.roomData, state: event.type }
                    });
                return;
            case UpdateDoorStateEvent.STATE_ACCEPTED:
                setPendingDoorState(null);
                return;
        }
    }, []);

    useUiEvent(UpdateDoorStateEvent.START_DOORBELL, onUpdateDoorStateEvent);
    useUiEvent(UpdateDoorStateEvent.START_PASSWORD, onUpdateDoorStateEvent);
    useUiEvent(UpdateDoorStateEvent.STATE_WAITING, onUpdateDoorStateEvent);
    useUiEvent(UpdateDoorStateEvent.STATE_NO_ANSWER, onUpdateDoorStateEvent);
    useUiEvent(UpdateDoorStateEvent.STATE_WRONG_PASSWORD, onUpdateDoorStateEvent);
    useUiEvent(UpdateDoorStateEvent.STATE_ACCEPTED, onUpdateDoorStateEvent);

    const onRoomSessionEvent = useCallback((event: RoomSessionEvent) =>
    {
        switch(event.type)
        {
            case RoomSessionEvent.CREATED:
                setIsVisible(false);
                setCreatorOpen(false);
                return;
        }
    }, []);

    useRoomSessionManagerEvent(RoomSessionEvent.CREATED, onRoomSessionEvent);

    const sendSearch = useCallback((searchValue: string, contextCode: string) =>
    {
        setCreatorOpen(false);
        SendMessageHook(new NavigatorSearchComposer(contextCode, searchValue));
    }, []);

    const goToHomeRoom = useCallback(() =>
    {
        if(homeRoomId <= 0) return;

        TryVisitRoom(homeRoomId);
    }, [ homeRoomId ]);

    const linkReceived = useCallback((url: string) =>
    {
        const parts = url.split('/');

        if(parts.length < 2) return;

        switch(parts[1])
        {
            case 'goto':
                if(parts.length > 2)
                {
                    switch(parts[2])
                    {
                        case 'home':
                            goToHomeRoom();
                            break;
                        default: {
                            const roomId = parseInt(parts[2]);

                            TryVisitRoom(roomId);
                        }
                    }
                }
                return;
            case 'create':
                setIsVisible(true);
                setCreatorOpen(true);
                return;
        } 
    }, [ goToHomeRoom ]);

    const closePendingDoorState = useCallback((state: string) =>
    {
        if(state !== null)
        {
            setPendingDoorState(prevValue =>
                {
                    return { roomData: prevValue.roomData, state };
                });
        }
        else setPendingDoorState(null);
    }, []);

    useEffect(() =>
    {
        const linkTracker: ILinkEventTracker = {
            linkReceived,
            eventUrlPrefix: 'navigator/'
        };

        AddEventLinkTracker(linkTracker);

        return () => RemoveLinkEventTracker(linkTracker);
    }, [ linkReceived]);

    const enterRoomWebRequest = useCallback((k: string, _arg_2:boolean=false, _arg_3:string=null) =>
    {
        SendMessageHook(new ConvertGlobalRoomIdMessageComposer(k));
    }, []);

    UseMountEffect(() =>
    {
        LegacyExternalInterface.addCallback(HabboWebTools.OPENROOM, enterRoomWebRequest);
    });

    useEffect(() =>
    {
        if(!isVisible || !needsNavigatorUpdate) return;
        
        dispatchNavigatorState({
            type: NavigatorActions.SET_NEEDS_UPDATE,
            payload: {
                flag: false
            }
        });
        
        SendMessageHook(new NavigatorInitComposer());
    }, [ isVisible, needsNavigatorUpdate ]);

    useEffect(() =>
    {
        if(!topLevelContexts || !topLevelContexts.length) return;

        sendSearch('', topLevelContexts[0].code);
    }, [ topLevelContexts, sendSearch ]);

    const getRoomDoorState = useMemo(() =>
    {
        if(!pendingDoorState) return null;

        switch(pendingDoorState.state)
        {
            case UpdateDoorStateEvent.START_DOORBELL:
            case UpdateDoorStateEvent.STATE_WAITING:
            case UpdateDoorStateEvent.STATE_NO_ANSWER:
                return <NavigatorRoomDoorbellView roomData={ pendingDoorState.roomData } state={ pendingDoorState.state } onClose={ closePendingDoorState } />;
            case UpdateDoorStateEvent.START_PASSWORD:
            case UpdateDoorStateEvent.STATE_WRONG_PASSWORD:
                return <NavigatorRoomPasswordView roomData={ pendingDoorState.roomData } state={ pendingDoorState.state } onClose={ closePendingDoorState } />;
        }

        return null;
    }, [ pendingDoorState, closePendingDoorState ]);

    return (
        <NavigatorContextProvider value={ { navigatorState, dispatchNavigatorState } }>
            <NavigatorMessageHandler />
            { getRoomDoorState }
            { isVisible &&
                <NitroCardView uniqueKey="navigator" className="nitro-navigator">
                    <NitroCardHeaderView headerText={ LocalizeText(isCreatorOpen ? 'navigator.createroom.title' : 'navigator.title') } onCloseClick={ event => setIsVisible(false) } />
                    <NitroCardTabsView>
                        { topLevelContexts && (topLevelContexts.length > 0) && topLevelContexts.map((context, index) =>
                            {
                                return (
                                    <NitroCardTabsItemView key={ index } isActive={ ((topLevelContext === context) && !isCreatorOpen) } onClick={ event => sendSearch('', context.code) }>
                                        { LocalizeText(('navigator.toplevelview.' + context.code)) }
                                    </NitroCardTabsItemView>
                                );
                            }) }
                        <NitroCardTabsItemView isActive={ isCreatorOpen } onClick={ event => setCreatorOpen(true) }>
                            <FontAwesomeIcon icon="plus" />
                        </NitroCardTabsItemView>
                    </NitroCardTabsView>
                    <NitroCardContentView>
                        { !isCreatorOpen &&
                            <>
                                <NavigatorSearchView sendSearch={ sendSearch } />
                                <Column overflow="auto">
                                    { (navigatorState.searchResult && navigatorState.searchResult.results.map((result, index) => <NavigatorSearchResultView key={ index } searchResult={ result } />)) }
                                </Column>
                            </> }
                        { isCreatorOpen && <NavigatorRoomCreatorView /> }
                    </NitroCardContentView>
                </NitroCardView> }
            { isRoomInfoOpen && <NavigatorRoomInfoView onCloseClick={ () => setRoomInfoOpen(false) } /> }
            { isRoomLinkOpen && <NavigatorRoomLinkView onCloseClick={ () => setRoomLinkOpen(false) } /> }
            <NavigatorRoomSettingsView />
        </NavigatorContextProvider>
    );
}
