import { ILinkEventTracker, NavigatorInitComposer, NavigatorSearchComposer, RoomSessionEvent } from '@nitrots/nitro-renderer';
import { FC, useCallback, useEffect, useReducer, useState } from 'react';
import { AddEventLinkTracker, RemoveLinkEventTracker } from '../../api';
import { TryVisitRoom } from '../../api/navigator/TryVisitRoom';
import { NavigatorEvent } from '../../events';
import { useRoomSessionManagerEvent } from '../../hooks/events/nitro/session/room-session-manager-event';
import { useUiEvent } from '../../hooks/events/ui/ui-event';
import { SendMessageHook } from '../../hooks/messages/message-event';
import { NitroCardContentView, NitroCardHeaderView, NitroCardTabsItemView, NitroCardTabsView, NitroCardView } from '../../layout';
import { LocalizeText } from '../../utils/LocalizeText';
import { NavigatorContextProvider } from './context/NavigatorContext';
import { NavigatorMessageHandler } from './NavigatorMessageHandler';
import { NavigatorViewProps } from './NavigatorView.types';
import { initialNavigator, NavigatorActions, NavigatorReducer } from './reducers/NavigatorReducer';
import { NavigatorRoomCreatorView } from './views/creator/NavigatorRoomCreatorView';
import { NavigatorRoomInfoView } from './views/room-info/NavigatorRoomInfoView';
import { NavigatorRoomLinkView } from './views/room-link/NavigatorRoomLinkView';
import { NavigatorRoomSettingsView } from './views/room-settings/NavigatorRoomSettingsView';
import { NavigatorSearchResultSetView } from './views/search-result-set/NavigatorSearchResultSetView';
import { NavigatorSearchView } from './views/search/NavigatorSearchView';

export const NavigatorView: FC<NavigatorViewProps> = props =>
{
    const [ isVisible, setIsVisible ] = useState(false);
    const [ isCreatorOpen, setCreatorOpen ] = useState(false);
    const [ isRoomInfoOpen, setRoomInfoOpen ] = useState(false);
    const [ isRoomLinkOpen, setRoomLinkOpen ] = useState(false);
    const [ navigatorState, dispatchNavigatorState ] = useReducer(NavigatorReducer, initialNavigator);
    const { needsNavigatorUpdate = false, topLevelContext = null, topLevelContexts = null } = navigatorState;

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
                            //goToHomeRoom();
                            break;
                        default: {
                            const roomId = parseInt(parts[2]);

                            TryVisitRoom(roomId);
                        }
                    }
                }
                return;
        }
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

    return (
        <NavigatorContextProvider value={ { navigatorState, dispatchNavigatorState } }>
            <NavigatorMessageHandler />
            { isVisible &&
                <NitroCardView className="nitro-navigator">
                    <NitroCardHeaderView headerText={ LocalizeText(isCreatorOpen ? 'navigator.createroom.title' : 'navigator.title') } onCloseClick={ event => setIsVisible(false) } />
                    <NitroCardTabsView>
                        { topLevelContexts.map((context, index) =>
                            {
                                return (
                                    <NitroCardTabsItemView key={ index } isActive={ ((topLevelContext === context) && !isCreatorOpen) } onClick={ event => sendSearch('', context.code) }>
                                        { LocalizeText(('navigator.toplevelview.' + context.code)) }
                                    </NitroCardTabsItemView>
                                );
                            }) }
                        <NitroCardTabsItemView isActive={ isCreatorOpen } onClick={ () => setCreatorOpen(true) }>
                            <i className="fas fa-plus" />
                        </NitroCardTabsItemView>
                    </NitroCardTabsView>
                    <NitroCardContentView>
                    <div className="d-flex flex-column h-100">
                        { !isCreatorOpen && <>
                            <NavigatorSearchView sendSearch={ sendSearch } />
                            <NavigatorSearchResultSetView />
                        </> }
                        { isCreatorOpen && <NavigatorRoomCreatorView /> }
                    </div>
                    </NitroCardContentView>
                </NitroCardView> }
            { isRoomInfoOpen && <NavigatorRoomInfoView onCloseClick={ () => setRoomInfoOpen(false) } /> }
            { isRoomLinkOpen && <NavigatorRoomLinkView onCloseClick={ () => setRoomLinkOpen(false) } /> }
            <NavigatorRoomSettingsView />
        </NavigatorContextProvider>
    );
}
