import React, { FC, useCallback, useEffect, useState } from 'react';
import { FriendListEvent } from '../../events';
import { DraggableWindow } from '../../hooks/draggable-window/DraggableWindow';
import { useUiEvent } from '../../hooks/events/ui/ui-event';
import { LocalizeText } from '../../utils/LocalizeText';
import { FriendListMessageHandler } from './FriendListMessageHandler';
import { FriendListTabs, FriendListViewProps, IFriendListContext } from './FriendListView.types';
import { FriendListTabsContentView } from './tabs-content/FriendListTabsContentView';
import { FriendListTabsSelectorView } from './tabs-selector/FriendListTabsSelectorView';

export const FriendListContext = React.createContext<IFriendListContext>(null);

export const FriendListView: FC<FriendListViewProps> = props =>
{
    const [ isVisible, setIsVisible ] = useState(false);
    const [ currentTab, setCurrentTab ] = useState<string>(null);
    const [ tabs, setTabs ]             = useState<string[]>([ 
        FriendListTabs.FRIENDS, FriendListTabs.REQUESTS, FriendListTabs.SEARCH
     ]);

    useEffect(() => {
        setCurrentTab(tabs[0]);
    }, [ tabs ]);

    const onFriendListEvent = useCallback((event: FriendListEvent) =>
    {
        switch(event.type)
        {
            case FriendListEvent.SHOW_FRIEND_LIST:
                setIsVisible(true);
                return;
            case FriendListEvent.TOGGLE_FRIEND_LIST:
                setIsVisible(value => !value);
                return;
        }
    }, []);

    useUiEvent(FriendListEvent.SHOW_FRIEND_LIST, onFriendListEvent);
    useUiEvent(FriendListEvent.TOGGLE_FRIEND_LIST, onFriendListEvent);

    function hideFriendList(): void
    {
        setIsVisible(false);
    }

    return (
        <FriendListContext.Provider value={{ currentTab: currentTab, onSetCurrentTab: setCurrentTab }}>
            <FriendListMessageHandler  />
            { isVisible && <DraggableWindow handle=".drag-handler">
                <div className="nitro-friend-list d-flex flex-column bg-primary border border-black shadow rounded">
                    <div className="drag-handler d-flex justify-content-between align-items-center px-3 pt-3">
                        <div className="h6 m-0">{ LocalizeText('friendlist.friends') }</div>
                        <button type="button" className="close" onClick={ hideFriendList }>
                            <i className="fas fa-times"></i>
                        </button>
                    </div>
                    <FriendListTabsSelectorView tabs={ tabs } />
                    <FriendListTabsContentView />
                </div>
            </DraggableWindow> }
        </FriendListContext.Provider>
    );
}
