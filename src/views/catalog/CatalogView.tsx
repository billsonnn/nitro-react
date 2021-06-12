import { CatalogModeComposer, ICatalogPageData, RoomPreviewer } from 'nitro-renderer';
import { FC, useCallback, useEffect, useReducer, useState } from 'react';
import { GetRoomEngine } from '../../api';
import { GetCatalogPageComposer } from '../../api/catalog/GetCatalogPageComposer';
import { CatalogEvent } from '../../events';
import { useUiEvent } from '../../hooks/events/ui/ui-event';
import { SendMessageHook } from '../../hooks/messages/message-event';
import { NitroCardContentView, NitroCardHeaderView, NitroCardTabsItemView, NitroCardTabsView, NitroCardView } from '../../layout';
import { LocalizeText } from '../../utils/LocalizeText';
import { CatalogMessageHandler } from './CatalogMessageHandler';
import { CatalogMode, CatalogViewProps } from './CatalogView.types';
import { CatalogContextProvider } from './context/CatalogContext';
import { CatalogActions, CatalogReducer, initialCatalog } from './reducers/CatalogReducer';
import { CatalogNavigationView } from './views/navigation/CatalogNavigationView';
import { CatalogPageView } from './views/page/CatalogPageView';

export const CatalogView: FC<CatalogViewProps> = props =>
{
    const [ isVisible, setIsVisible ] = useState(false);
    const [ roomPreviewer, setRoomPreviewer ] = useState<RoomPreviewer>(null);
    const [ catalogState, dispatchCatalogState ] = useReducer(CatalogReducer, initialCatalog);
    const { root = null, currentTab = null, pageParser = null, activeOffer = null, searchResult = null } = catalogState;

    const onCatalogEvent = useCallback((event: CatalogEvent) =>
    {
        switch(event.type)
        {
            case CatalogEvent.SHOW_CATALOG:
                setIsVisible(true);
                return;
            case CatalogEvent.HIDE_CATALOG:
                setIsVisible(false);
                return;   
            case CatalogEvent.TOGGLE_CATALOG:
                setIsVisible(value => !value);
                return;
        }
    }, []);

    useUiEvent(CatalogEvent.SHOW_CATALOG, onCatalogEvent);
    useUiEvent(CatalogEvent.HIDE_CATALOG, onCatalogEvent);
    useUiEvent(CatalogEvent.TOGGLE_CATALOG, onCatalogEvent);
    useUiEvent(CatalogEvent.CATALOG_RESET, onCatalogEvent);

    useEffect(() =>
    {
        if(!isVisible) return;
        
        if(!catalogState.root)
        {
            SendMessageHook(new CatalogModeComposer(CatalogMode.MODE_NORMAL));
        }
    }, [ isVisible, catalogState.root ]);

    useEffect(() =>
    {
        if(!currentTab) return;

        SendMessageHook(GetCatalogPageComposer(currentTab.pageId, -1, CatalogMode.MODE_NORMAL));
    }, [ currentTab ]);

    useEffect(() =>
    {
        setRoomPreviewer(new RoomPreviewer(GetRoomEngine(), ++RoomPreviewer.PREVIEW_COUNTER));

        return () =>
        {
            setRoomPreviewer(prevValue =>
                {
                    prevValue.dispose();

                    return null;
                });
        }
    }, []);

    const setCurrentTab = useCallback((page: ICatalogPageData) =>
    {
        dispatchCatalogState({
            type: CatalogActions.SET_CATALOG_CURRENT_TAB,
            payload: {
                currentTab: page
            }
        });
    }, [ dispatchCatalogState ]);

    const currentNavigationPage = ((searchResult && searchResult.page) || currentTab);

    return (
        <CatalogContextProvider value={ { catalogState, dispatchCatalogState } }>
            <CatalogMessageHandler />
            { isVisible &&
                <NitroCardView className="nitro-catalog">
                    <NitroCardHeaderView headerText={ LocalizeText('catalog.title') } onCloseClick={ event => setIsVisible(false) } />
                    <NitroCardTabsView>
                        { root && root.children.length && root.children.map((page, index) =>
                            {
                                return (
                                    <NitroCardTabsItemView key={ index } isActive={ (currentTab === page) } onClick={ event => setCurrentTab(page) }>
                                        { page.localization }
                                    </NitroCardTabsItemView>
                                );
                            }) }
                    </NitroCardTabsView>
                    <NitroCardContentView>
                        <div className="row h-100">
                            { pageParser && !pageParser.frontPageItems.length &&
                                <div className="col-3">
                                    <CatalogNavigationView page={ currentNavigationPage } />
                                </div> }
                            <div className="col">
                                <CatalogPageView roomPreviewer={ roomPreviewer } />
                            </div>
                        </div>
                    </NitroCardContentView>
                </NitroCardView> }
        </CatalogContextProvider>
    );
}
