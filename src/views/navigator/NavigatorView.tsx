import { NavigatorInitComposer, NavigatorSearchComposer, NavigatorSearchResultList, NavigatorTopLevelContext, RoomSessionEvent } from 'nitro-renderer';
import { MouseEvent, useCallback, useEffect, useState } from 'react';
import { NavigatorEvent } from '../../events';
import { DraggableWindow } from '../../hooks/draggable-window/DraggableWindow';
import { useRoomSessionManagerEvent } from '../../hooks/events/nitro/session/room-session-manager-event';
import { useUiEvent } from '../../hooks/events/ui/ui-event';
import { SendMessageHook } from '../../hooks/messages/message-event';
import { LocalizeText } from '../../utils/LocalizeText';
import { NavigatorMessageHandler } from './NavigatorMessageHandler';
import { NavigatorViewProps } from './NavigatorView.types';
import { NavigatorResultListsView } from './result-lists/NavigatorResultListsView';
import { NavigatorTabsView } from './tabs/NavigatorTabsView';

export function NavigatorView(props: NavigatorViewProps): JSX.Element
{
    const [ isVisible, setIsVisible ]   = useState(false);
    const [ isLoaded, setIsLoaded ]     = useState(false);
    const [ isLoading, setIsLoading ]   = useState(false);
    const [ isSearching, setIsSearching ] = useState(false);

    const [ topLevelContexts, setTopLevelContexts ] = useState<NavigatorTopLevelContext[]>(null);
    const [ topLevelContext, setTopLevelContext ] = useState<NavigatorTopLevelContext>(null);
    const [ searchResults, setSearchResults ] = useState<NavigatorSearchResultList[]>(null);

    function hideNavigator(event: MouseEvent = null): void
    {
        if(event) event.preventDefault();

        setIsVisible(false);
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
        <>
            <NavigatorMessageHandler setTopLevelContext={ setTopLevelContext } setTopLevelContexts={ setTopLevelContexts } setSearchResults={ setSearchResults } />
            { isVisible && <DraggableWindow handle=".drag-handler">
                <div className="nitro-navigator d-flex flex-column bg-primary border border-black shadow rounded position-absolute">
                    <div className="drag-handler d-flex justify-content-between align-items-center px-3 pt-3">
                        <div className="h6 m-0">{ LocalizeText((isLoading || isSearching) ? 'navigator.title.is.busy' : 'navigator.title') }</div>
                        <button type="button" className="close" onClick={ hideNavigator }>
                            <i className="fas fa-times"></i>
                        </button>
                    </div>
                    <NavigatorTabsView topLevelContext={ topLevelContext } topLevelContexts={ topLevelContexts } setTopLevelContext={ setTopLevelContext } />
                    <NavigatorResultListsView resultLists={ searchResults } />
                </div>
            </DraggableWindow> }
        </>
    );
}
