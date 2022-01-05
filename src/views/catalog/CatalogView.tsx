import { GetCatalogIndexComposer, GetCatalogPageComposer, GetClubGiftInfo, GetGiftWrappingConfigurationComposer, GetMarketplaceConfigurationMessageComposer, ILinkEventTracker, INodeData, RoomPreviewer } from '@nitrots/nitro-renderer';
import { FC, useCallback, useEffect, useReducer, useState } from 'react';
import { AddEventLinkTracker, GetRoomEngine, LocalizeText, RemoveLinkEventTracker } from '../../api';
import { CREDITS, PlaySound } from '../../api/utils/PlaySound';
import { CatalogEvent } from '../../events';
import { UseMountEffect } from '../../hooks';
import { useUiEvent } from '../../hooks/events/ui/ui-event';
import { SendMessageHook } from '../../hooks/messages/message-event';
import { NitroCardContentView, NitroCardHeaderView, NitroCardTabsItemView, NitroCardTabsView, NitroCardView, NitroLayoutGrid, NitroLayoutGridColumn } from '../../layout';
import { CatalogMessageHandler } from './CatalogMessageHandler';
import { CatalogMode, CatalogViewProps } from './CatalogView.types';
import { BuildCatalogPageTree } from './common/CatalogUtilities';
import { CatalogContextProvider } from './context/CatalogContext';
import { CatalogReducer, initialCatalog } from './reducers/CatalogReducer';
import { CatalogGiftView } from './views/gift/CatalogGiftView';
import { ACTIVE_PAGES, CatalogNavigationView } from './views/navigation/CatalogNavigationView';
import { CatalogPageView } from './views/page/CatalogPageView';
import { MarketplacePostOfferView } from './views/page/layout/marketplace/post-offer/MarketplacePostOfferView';

export const CatalogView: FC<CatalogViewProps> = props =>
{
    const [ isVisible, setIsVisible ] = useState(false);
    const [ roomPreviewer, setRoomPreviewer ] = useState<RoomPreviewer>(null);
    const [ pendingPageLookup, setPendingPageLookup ] = useState<{ value: string, isOffer: boolean }>(null);
    const [ pendingTree, setPendingTree ] = useState<INodeData[]>(null);
    const [ pendingOpenTree, setPendingOpenTree ] = useState<INodeData[]>(null);
    const [ catalogState, dispatchCatalogState ] = useReducer(CatalogReducer, initialCatalog);
    const [ currentTab, setCurrentTab ] = useState<INodeData>(null);
    const { root = null, pageParser = null, activeOffer = null, searchResult = null } = catalogState;

    const saveActivePages = useCallback(() =>
    {
        setPendingOpenTree(ACTIVE_PAGES.slice());
    }, []);

    const onCatalogEvent = useCallback((event: CatalogEvent) =>
    {
        let save = false;

        switch(event.type)
        {
            case CatalogEvent.SHOW_CATALOG:
                setIsVisible(true);
                return;
            case CatalogEvent.HIDE_CATALOG:
                save = true;
                setIsVisible(false);
                return;   
            case CatalogEvent.TOGGLE_CATALOG:
                save = true;
                setIsVisible(value => !value);
                return;
            case CatalogEvent.PURCHASE_SUCCESS:
                PlaySound(CREDITS);
                return;
        }

        if(save) saveActivePages();
    }, [ saveActivePages ]);

    useUiEvent(CatalogEvent.SHOW_CATALOG, onCatalogEvent);
    useUiEvent(CatalogEvent.HIDE_CATALOG, onCatalogEvent);
    useUiEvent(CatalogEvent.TOGGLE_CATALOG, onCatalogEvent);
    useUiEvent(CatalogEvent.CATALOG_RESET, onCatalogEvent);
    useUiEvent(CatalogEvent.PURCHASE_SUCCESS, onCatalogEvent);

    const linkReceived = useCallback((url: string) =>
    {
        const parts = url.split('/');

        if(parts.length < 2) return;

        switch(parts[1])
        {
            case 'open':
                if(parts.length > 2)
                {
                    if(parts.length === 4)
                    {
                        switch(parts[2])
                        {
                            case 'offerId':
                                setPendingPageLookup({ value: parts[3], isOffer: true });

                                return;
                        }
                    }

                    setPendingPageLookup({ value: parts[2], isOffer: false });
                }
                else
                {
                    setIsVisible(true);
                }

                return;
        }
    }, []);

    useEffect(() =>
    {
        const linkTracker: ILinkEventTracker = {
            linkReceived,
            eventUrlPrefix: 'catalog/'
        };

        AddEventLinkTracker(linkTracker);

        return () => RemoveLinkEventTracker(linkTracker);
    }, [ linkReceived ]);

    useEffect(() =>
    {
        const loadCatalog = (((pendingPageLookup !== null) && !catalogState.root) || (isVisible && !catalogState.root));

        if(loadCatalog)
        {
            SendMessageHook(new GetCatalogIndexComposer(CatalogMode.MODE_NORMAL));

            return;
        }

        if(catalogState.root)
        {
            if(!isVisible && (pendingPageLookup !== null))
            {
                setIsVisible(true);

                return;
            }

            if(pendingPageLookup !== null || pendingOpenTree)
            {
                let tree: INodeData[] = [];

                if(pendingPageLookup !== null)
                {
                    tree = BuildCatalogPageTree(catalogState.root, pendingPageLookup.value, pendingPageLookup.isOffer);
                }
                else
                {
                    tree = pendingOpenTree.slice();
                }

                setCurrentTab(tree.shift());
                setPendingOpenTree(null);
                setPendingPageLookup(null);
                setPendingTree(tree);
            }
            else
            {
                setCurrentTab(prevValue =>
                    {
                        if(catalogState.root.children.length)
                        {
                            if(prevValue)
                            {
                                if(catalogState.root.children.indexOf(prevValue) >= 0) return prevValue;
                            }

                            return ((catalogState.root.children.length && catalogState.root.children[0]) || null);
                        }

                        return null;
                    });
            }
        }
    }, [ isVisible, pendingPageLookup, pendingOpenTree, catalogState.root, setCurrentTab ]);

    useEffect(() =>
    {
        if(!currentTab) return;

        SendMessageHook(new GetCatalogPageComposer(currentTab.pageId, -1, CatalogMode.MODE_NORMAL));
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

    UseMountEffect(() =>
    {
        SendMessageHook(new GetMarketplaceConfigurationMessageComposer());
        SendMessageHook(new GetGiftWrappingConfigurationComposer());
        SendMessageHook(new GetClubGiftInfo());
    });

    const currentNavigationPage = ((searchResult && searchResult.page) || currentTab);
    const navigationHidden = !!(pageParser && pageParser.frontPageItems.length);

    return (
        <CatalogContextProvider value={ { catalogState, dispatchCatalogState } }>
            <CatalogMessageHandler />
            { isVisible &&
                <NitroCardView uniqueKey="catalog" className="nitro-catalog">
                    <NitroCardHeaderView headerText={ LocalizeText('catalog.title') } onCloseClick={ event => { saveActivePages(); setIsVisible(false); } } />
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
                        <NitroLayoutGrid>
                            { currentNavigationPage && !navigationHidden &&
                                <NitroLayoutGridColumn size={ 3 }>
                                    <CatalogNavigationView page={ currentNavigationPage } pendingTree={ pendingTree } setPendingTree={ setPendingTree } />
                                </NitroLayoutGridColumn> }
                            <NitroLayoutGridColumn size={ (navigationHidden ? 12 : 9) }>
                                <CatalogPageView roomPreviewer={ roomPreviewer } />
                            </NitroLayoutGridColumn>
                        </NitroLayoutGrid>
                    </NitroCardContentView>
                </NitroCardView> }
                <CatalogGiftView />
                <MarketplacePostOfferView />
        </CatalogContextProvider>
    );
}
