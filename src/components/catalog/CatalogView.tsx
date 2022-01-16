import { FrontPageItem, GetCatalogIndexComposer, GetCatalogPageComposer, GetClubGiftInfo, GetGiftWrappingConfigurationComposer, GetMarketplaceConfigurationMessageComposer, ILinkEventTracker, RoomPreviewer } from '@nitrots/nitro-renderer';
import { FC, useCallback, useEffect, useReducer, useState } from 'react';
import { AddEventLinkTracker, GetRoomEngine, LocalizeText, RemoveLinkEventTracker } from '../../api';
import { CREDITS, PlaySound } from '../../api/utils/PlaySound';
import { Column } from '../../common/Column';
import { Grid } from '../../common/Grid';
import { CatalogEvent } from '../../events';
import { BatchUpdates, UseMountEffect } from '../../hooks';
import { useUiEvent } from '../../hooks/events/ui/ui-event';
import { SendMessageHook } from '../../hooks/messages/message-event';
import { NitroCardContentView, NitroCardHeaderView, NitroCardTabsView, NitroCardView } from '../../layout';
import { CatalogMessageHandler } from './CatalogMessageHandler';
import { CatalogPage } from './common/CatalogPage';
import { CatalogType } from './common/CatalogType';
import { ICatalogNode } from './common/ICatalogNode';
import { ICatalogPage } from './common/ICatalogPage';
import { IPageLocalization } from './common/IPageLocalization';
import { IPurchasableOffer } from './common/IPurchasableOffer';
import { RequestedPage } from './common/RequestedPage';
import { CatalogContextProvider } from './context/CatalogContext';
import { CatalogReducer, initialCatalog } from './reducers/CatalogReducer';
import { CatalogGiftView } from './views/gift/CatalogGiftView';
import { CatalogNavigationView } from './views/navigation/CatalogNavigationView';
import { CatalogPageView } from './views/page/CatalogPageView';
import { MarketplacePostOfferView } from './views/page/layout/marketplace/MarketplacePostOfferView';
import { CatalogTabsViews } from './views/tabs/CatalogTabsView';

const DUMMY_PAGE_ID_FOR_OFFER_SEARCH: number = -12345678;

export const CatalogView: FC<{}> = props =>
{
    const [ isVisible, setIsVisible ] = useState(false);
    const [ isInitialized, setIsInitialized ] = useState(false);
    const [ isBusy, setIsBusy ] = useState(false);
    const [ forceRefresh, setForceRefresh ] = useState(false);
    const [ pageId, setPageId ] = useState(-1);
    const [ previousPageId, setPreviousPageId ] = useState(-1);
    const [ currentType, setCurrentType ] = useState(CatalogType.NORMAL);
    const [ currentNode, setCurrentNode ] = useState<ICatalogNode>(null);
    const [ currentOffers, setCurrentOffers ] = useState<Map<number, ICatalogNode[]>>(null);
    const [ currentPage, setCurrentPage ] = useState<ICatalogPage>(null);
    const [ currentOffer, setCurrentOffer ] = useState<IPurchasableOffer>(null);
    const [ purchasableOffer, setPurchasableOffer ] = useState<IPurchasableOffer>(null);
    const [ currentTab, setCurrentTab ] = useState<ICatalogNode>(null);
    const [ activeNodes, setActiveNodes ] = useState<ICatalogNode[]>([]);
    const [ lastActiveNodes, setLastActiveNodes ] = useState<ICatalogNode[]>(null);
    const [ frontPageItems, setFrontPageItems ] = useState<FrontPageItem[]>([]);


    const [ requestedPage, setRequestedPage ] = useState(new RequestedPage());
    const [ roomPreviewer, setRoomPreviewer ] = useState<RoomPreviewer>(null);
    const [ catalogState, dispatchCatalogState ] = useReducer(CatalogReducer, initialCatalog);

    const loadCatalogPage = useCallback((pageId: number, offerId: number, forceRefresh: boolean = false) =>
    {
        if(pageId < 0) return;
        
        BatchUpdates(() =>
        {
            setIsBusy(true);
            setPageId(pageId);
            
            if(forceRefresh) setForceRefresh(true);
        });

        SendMessageHook(new GetCatalogPageComposer(pageId, offerId, currentType));
    }, [ currentType ]);

    const selectOffer = useCallback((offerId: number) =>
    {

    }, []);

    const showCatalogPage = useCallback((pageId: number, layoutCode: string, localization: IPageLocalization, offers: IPurchasableOffer[], offerId: number, acceptSeasonCurrencyAsCredits: boolean) =>
    {
        if(currentPage)
        {
            if(!forceRefresh && (currentPage.pageId === pageId))
            {
                if(offerId > -1) selectOffer(offerId);

                return;
            }
        }

        const catalogPage = (new CatalogPage(pageId, layoutCode, localization, offers, acceptSeasonCurrencyAsCredits) as ICatalogPage);

        BatchUpdates(() =>
        {
            setCurrentPage(catalogPage);
            setPreviousPageId(prevValue => ((pageId > DUMMY_PAGE_ID_FOR_OFFER_SEARCH) ? pageId : prevValue));
            setForceRefresh(false);

            selectOffer(offerId);
        });
    }, [ currentPage, forceRefresh, selectOffer ]);

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
    }, []);

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
                                //setPendingPageLookup({ value: parts[3], isOffer: true });

                                return;
                        }
                    }

                    //setPendingPageLookup({ value: parts[2], isOffer: false });
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

    useEffect(() =>
    {
        if(!currentNode) return;

        switch(requestedPage.requestType)
        {
            // case RequestedPage.REQUEST_TYPE_NONE:
            //     loadFrontPage();
            //     return;
            case RequestedPage.REQUEST_TYPE_ID:
                requestedPage.resetRequest();
                return;
            case RequestedPage.REQUEST_TYPE_NAME:
                requestedPage.resetRequest();
                return;
        }
    }, [ currentNode, requestedPage ]);

    useEffect(() =>
    {
        if(!isVisible) return;

        if(!isInitialized) SendMessageHook(new GetCatalogIndexComposer(currentType));
    }, [ isVisible, isInitialized, currentType ]);

    useEffect(() =>
    {
        if(!currentNode || !currentTab) return;

        const activeNodes: ICatalogNode[] = [];

        if(currentTab.isVisible && !currentTab.children.length && (currentTab !== currentNode))
        {
            loadCatalogPage(currentTab.pageId, -1);
        }
        else
        {
            if(currentTab.children.length)
            {
                for(const child of currentTab.children)
                {
                    if(child.isVisible)
                    {
                        activeNodes.push(child);

                        loadCatalogPage(child.pageId, -1);

                        break;
                    }
                }
            }
        }

        // if(currentTab.children.length)
        // {
        //     for(const child of currentTab.children)
        //     {
        //         if(child.isVisible)
        //         {
        //             activeNodes.push(child);

        //             loadCatalogPage(child.pageId, -1);

        //             break;
        //         }
        //     }
        // }

        setActiveNodes(activeNodes);
    }, [ currentNode, currentTab, loadCatalogPage ]);

    useEffect(() =>
    {
        if(!currentPage) return;

        setCurrentOffer(null);
    }, [ currentPage ]);

    useEffect(() =>
    {
        if(!currentNode) return;

        BatchUpdates(() =>
        {
            setIsInitialized(true);

            if(currentNode.isBranch)
            {
                for(const child of currentNode.children)
                {
                    if(child && child.isVisible)
                    {
                        setCurrentTab(child);

                        return;
                    }
                }
            }
        });
    }, [ currentNode ]);

    useEffect(() =>
    {
        if(!isVisible && !lastActiveNodes && activeNodes && activeNodes.length)
        {
            setLastActiveNodes(activeNodes.concat());
        }

        else if(isVisible && lastActiveNodes)
        {
            BatchUpdates(() =>
            {
                setActiveNodes(lastActiveNodes.concat());
                setLastActiveNodes(null);
            });
        }
    }, [ isVisible, lastActiveNodes, activeNodes ]);

    UseMountEffect(() =>
    {
        SendMessageHook(new GetMarketplaceConfigurationMessageComposer());
        SendMessageHook(new GetGiftWrappingConfigurationComposer());
        SendMessageHook(new GetClubGiftInfo());
    });

    return (
        <CatalogContextProvider value={ { isVisible, isBusy, setIsBusy, pageId, currentType, setCurrentType, currentNode, setCurrentNode, currentOffers, setCurrentOffers, currentPage, setCurrentPage, currentOffer, setCurrentOffer, purchasableOffer, setPurchasableOffer, activeNodes, setActiveNodes, frontPageItems, setFrontPageItems, loadCatalogPage, showCatalogPage, catalogState, dispatchCatalogState } }>
            <CatalogMessageHandler />
            { isVisible &&
                <NitroCardView uniqueKey="catalog" className="nitro-catalog">
                    <NitroCardHeaderView headerText={ LocalizeText('catalog.title') } onCloseClick={ event => { setIsVisible(false); } } />
                    <NitroCardTabsView>
                        <CatalogTabsViews node={ currentNode } currentTab={ currentTab } setCurrentTab={ setCurrentTab } />
                    </NitroCardTabsView>
                    <NitroCardContentView>
                        <Grid>
                            <Column size={ 3 } overflow="hidden">
                                <CatalogNavigationView node={ currentTab } />
                            </Column>
                            <Column size={ 9 } overflow="hidden">
                                <CatalogPageView page={ currentPage } roomPreviewer={ roomPreviewer } />
                            </Column>
                        </Grid>
                    </NitroCardContentView>
                </NitroCardView> }
                <CatalogGiftView />
                <MarketplacePostOfferView />
        </CatalogContextProvider>
    );
}
