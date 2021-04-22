import { NavigatorInitComposer, NavigatorSearchComposer, NavigatorSearchResultList, NavigatorTopLevelContext, RoomDataParser, RoomInfoComposer, RoomSessionEvent } from 'nitro-renderer';
import React, { MouseEvent, useCallback, useEffect, useState } from 'react';
import { GetRoomSessionManager } from '../../api';
import { NavigatorEvent } from '../../events';
import { DraggableWindow } from '../../hooks/draggable-window/DraggableWindow';
import { useRoomSessionManagerEvent } from '../../hooks/events/nitro/session/room-session-manager-event';
import { useUiEvent } from '../../hooks/events/ui/ui-event';
import { SendMessageHook } from '../../hooks/messages/message-event';
import { TransitionAnimation } from '../../transitions/TransitionAnimation';
import { TransitionAnimationTypes } from '../../transitions/TransitionAnimation.types';
import { LocalizeText } from '../../utils/LocalizeText';
import { NavigatorLockView } from './lock/NavigatorLockView';
import { NavigatorLockViewStage } from './lock/NavigatorLockView.types';
import { NavigatorMessageHandler } from './NavigatorMessageHandler';
import { INavigatorContext, NavigatorViewProps } from './NavigatorView.types';
import { NavigatorResultListsView } from './result-lists/NavigatorResultListsView';
import { NavigatorTabsView } from './tabs/NavigatorTabsView';

export const NavigatorContext = React.createContext<INavigatorContext>(null);

export function NavigatorView(props: NavigatorViewProps): JSX.Element
{
    const [ isVisible, setIsVisible ]           = useState(false);
    const [ isLoaded, setIsLoaded ]             = useState(false);
    const [ isLoading, setIsLoading ]           = useState(false);
    const [ isSearching, setIsSearching ]       = useState(false);
    const [ isLockVisible, setIsLockVisible ]   = useState(false);

    const [ lockStage, setLockStage ]               = useState<NavigatorLockViewStage>(NavigatorLockViewStage.INIT);
    const [ lastRoomVisited, setLastRoomVisited ]   = useState<RoomDataParser>(null);

    const [ topLevelContexts, setTopLevelContexts ] = useState<NavigatorTopLevelContext[]>(null);
    const [ topLevelContext, setTopLevelContext ]   = useState<NavigatorTopLevelContext>(null);
    const [ searchResults, setSearchResults ]       = useState<NavigatorSearchResultList[]>(null);

    function hideNavigator(event: MouseEvent = null): void
    {
        if(event) event.preventDefault();

        setIsVisible(false);
    }

    function hideLock(): void
    {
        setIsLockVisible(false);
        setLockStage(NavigatorLockViewStage.INIT);
    }

    function showLock(stage: NavigatorLockViewStage = NavigatorLockViewStage.INIT)
    {
        setLockStage(stage);
        setIsLockVisible(true);
    }

    function visitRoom(roomId: number, password: string = null): void
    {
        setIsLockVisible(false);
        GetRoomSessionManager().createSession(roomId, password);
    }

    function tryVisitRoom(room: RoomDataParser): void
    {
        setIsLockVisible(false);
        setLastRoomVisited(room);
        SendMessageHook(new RoomInfoComposer(room.roomId, false, true));
    }

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

        setIsSearching(true);

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

    useEffect(() =>
    {
        setIsSearching(false);
    }, [ searchResults ]);

    useUiEvent(NavigatorEvent.SHOW_NAVIGATOR, onNavigatorEvent);
    useUiEvent(NavigatorEvent.TOGGLE_NAVIGATOR, onNavigatorEvent);

    useRoomSessionManagerEvent(RoomSessionEvent.CREATED, onRoomSessionEvent);
    
    return (
        <NavigatorContext.Provider value={{ onTryVisitRoom: tryVisitRoom }}>
            <NavigatorMessageHandler setTopLevelContext={ setTopLevelContext } setTopLevelContexts={ setTopLevelContexts } setSearchResults={ setSearchResults } showLock={ showLock } hideLock={ hideLock } />
            { isVisible && <DraggableWindow handle=".drag-handler">
                <div className="nitro-navigator d-flex flex-column bg-primary border border-black shadow rounded">
                    <div className="drag-handler d-flex justify-content-between align-items-center px-3 pt-3">
                        <div className="h6 m-0">{ LocalizeText((isLoading || isSearching) ? 'navigator.title.is.busy' : 'navigator.title') }</div>
                        <button type="button" className="close" onClick={ hideNavigator }>
                            <i className="fas fa-times"></i>
                        </button>
                    </div>
                    <NavigatorTabsView topLevelContext={ topLevelContext } topLevelContexts={ topLevelContexts } setTopLevelContext={ setTopLevelContext } />
                    <TransitionAnimation className="d-flex px-3 pb-3" type={ TransitionAnimationTypes.FADE_IN } inProp={ (!isSearching && !!searchResults) } timeout={ 200 }>
                        <NavigatorResultListsView resultLists={ searchResults } />
                    </TransitionAnimation>
                </div>
            </DraggableWindow> }
            { isLockVisible && <NavigatorLockView roomData={ lastRoomVisited } stage={ lockStage } onHideLock={ hideLock } onVisitRoom={ visitRoom }></NavigatorLockView> }
        </NavigatorContext.Provider>
    );
}
