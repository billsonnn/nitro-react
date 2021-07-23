import { CatalogModeComposer, CatalogPageComposer, CatalogRequestGiftConfigurationComposer, ICatalogPageData, ILinkEventTracker, RoomPreviewer } from 'nitro-renderer';
import { FC, useCallback, useEffect, useReducer, useState } from 'react';
import { AddEventLinkTracker, GetRoomEngine, RemoveLinkEventTracker } from '../../api';
import { CatalogEvent } from '../../events';
import { useUiEvent } from '../../hooks/events/ui/ui-event';
import { SendMessageHook } from '../../hooks/messages/message-event';
import { NitroCardContentView, NitroCardHeaderView, NitroCardTabsItemView, NitroCardTabsView, NitroCardView } from '../../layout';
import { LocalizeText } from '../../utils/LocalizeText';
import { CatalogMessageHandler } from './CatalogMessageHandler';
import { CatalogMode, CatalogViewProps } from './CatalogView.types';
import { GetCatalogPageTree } from './common/CatalogUtilities';
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

    const setCurrentTab = useCallback((page: ICatalogPageData) =>
    {
        dispatchCatalogState({
            type: CatalogActions.SET_CATALOG_CURRENT_TAB,
            payload: {
                currentTab: page
            }
        });
    }, [ dispatchCatalogState ]);

    const navigateThroughTree = useCallback((tree: ICatalogPageData[]) =>
    {
        setCurrentTab(tree.shift());
    }, [ setCurrentTab ]);

    const navigateToPage = useCallback((pageId: number) =>
    {
        const pageTree: ICatalogPageData[] = [];

        GetCatalogPageTree(root, pageId, pageTree);

        if(!pageTree.length) return;

        pageTree.reverse();

        navigateThroughTree(pageTree);
    }, [ root, navigateThroughTree ]);

    const linkReceived = useCallback((url: string) =>
    {
        const parts = url.split('/');

        if(parts.length < 2) return;

        switch(parts[1])
        {
            case 'open':
                if(parts.length > 2)
                {
                    navigateToPage(parseInt(parts[2]));
                }
                else
                {
                    setIsVisible(true);
                }
                return;
        }
    }, [ navigateToPage ]);

    useEffect(() =>
    {
        const linkTracker: ILinkEventTracker = {
            linkReceived,
            eventUrlPrefix: 'catalog/'
        };

        AddEventLinkTracker(linkTracker);

        return () => RemoveLinkEventTracker(linkTracker);
    }, [ linkReceived]);

    useEffect(() =>
    {
        if(!isVisible) return;
        
        if(!catalogState.root)
        {
            SendMessageHook(new CatalogModeComposer(CatalogMode.MODE_NORMAL));
            SendMessageHook(new CatalogRequestGiftConfigurationComposer());
        }

        console.log(catalogState.root)
    }, [ isVisible, catalogState.root ]);

    useEffect(() =>
    {
        if(!currentTab) return;

        SendMessageHook(new CatalogPageComposer(currentTab.pageId, -1, CatalogMode.MODE_NORMAL));
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
                                <div className="col-3 d-flex flex-column h-100">
                                    <CatalogNavigationView page={ currentNavigationPage } />
                                </div> }
                            <div className="col h-100">
                                <CatalogPageView roomPreviewer={ roomPreviewer } />
                            </div>
                        </div>
                    </NitroCardContentView>
                </NitroCardView> }
        </CatalogContextProvider>
    );
}
