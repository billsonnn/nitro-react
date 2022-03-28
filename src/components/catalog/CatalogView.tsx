import { CatalogPublishedMessageEvent, FrontPageItem, GetCatalogIndexComposer, GetCatalogPageComposer, GetClubGiftInfo, GetGiftWrappingConfigurationComposer, ILinkEventTracker, RoomPreviewer } from '@nitrots/nitro-renderer';
import { FC, useCallback, useEffect, useState } from 'react';
import { AddEventLinkTracker, GetRoomEngine, LocalizeText, NotificationAlertType, NotificationUtilities, PlaySound, RemoveLinkEventTracker, SendMessageComposer, SoundNames } from '../../api';
import { Column, Grid, NitroCardContentView, NitroCardHeaderView, NitroCardTabsItemView, NitroCardTabsView, NitroCardView } from '../../common';
import { CatalogPurchasedEvent } from '../../events';
import { BatchUpdates, UseMessageEventHook, UseUiEvent } from '../../hooks';
import { CatalogContextProvider } from './CatalogContext';
import { CatalogMessageHandler } from './CatalogMessageHandler';
import { CatalogPage } from './common/CatalogPage';
import { CatalogType } from './common/CatalogType';
import { ICatalogNode } from './common/ICatalogNode';
import { ICatalogOptions } from './common/ICatalogOptions';
import { ICatalogPage } from './common/ICatalogPage';
import { IPageLocalization } from './common/IPageLocalization';
import { IPurchasableOffer } from './common/IPurchasableOffer';
import { IPurchaseOptions } from './common/IPurchaseOptions';
import { RequestedPage } from './common/RequestedPage';
import { SearchResult } from './common/SearchResult';
import { CatalogGiftView } from './views/gift/CatalogGiftView';
import { CatalogNavigationView } from './views/navigation/CatalogNavigationView';
import { GetCatalogLayout } from './views/page/layout/GetCatalogLayout';
import { MarketplacePostOfferView } from './views/page/layout/marketplace/MarketplacePostOfferView';

const REQUESTED_PAGE = new RequestedPage();

export const CatalogView: FC<{}> = props =>
{
    const [ isVisible, setIsVisible ] = useState(false);
    const [ isBusy, setIsBusy ] = useState(false);
    const [ pageId, setPageId ] = useState(-1);
    const [ previousPageId, setPreviousPageId ] = useState(-1);
    const [ currentType, setCurrentType ] = useState(CatalogType.NORMAL);
    const [ rootNode, setRootNode ] = useState<ICatalogNode>(null);
    const [ offersToNodes, setOffersToNodes ] = useState<Map<number, ICatalogNode[]>>(null);
    const [ currentPage, setCurrentPage ] = useState<ICatalogPage>(null);
    const [ currentOffer, setCurrentOffer ] = useState<IPurchasableOffer>(null);
    const [ activeNodes, setActiveNodes ] = useState<ICatalogNode[]>([]);
    const [ searchResult, setSearchResult ] = useState<SearchResult>(null);
    const [ frontPageItems, setFrontPageItems ] = useState<FrontPageItem[]>([]);
    const [ roomPreviewer, setRoomPreviewer ] = useState<RoomPreviewer>(null);
    const [ navigationHidden, setNavigationHidden ] = useState(false);
    const [ purchaseOptions, setPurchaseOptions ] = useState<IPurchaseOptions>({ quantity: 1, extraData: null, extraParamRequired: false, previewStuffData: null });
    const [ catalogOptions, setCatalogOptions ] = useState<ICatalogOptions>({});

    const resetState = useCallback(() =>
    {
        BatchUpdates(() =>
        {
            setPageId(-1);
            setPreviousPageId(-1);
            setRootNode(null);
            setOffersToNodes(null);
            setCurrentPage(null);
            setCurrentOffer(null);
            setActiveNodes([]);
            setSearchResult(null);
            setFrontPageItems([]);
            setIsVisible(false);
        });
    }, []);

    const onCatalogPublishedMessageEvent = useCallback((event: CatalogPublishedMessageEvent) =>
    {
        const wasVisible = isVisible;

        resetState();

        if(wasVisible) NotificationUtilities.simpleAlert(LocalizeText('catalog.alert.published.description'), NotificationAlertType.ALERT, null, null, LocalizeText('catalog.alert.published.title'));
    }, [ isVisible, resetState ]);

    UseMessageEventHook(CatalogPublishedMessageEvent, onCatalogPublishedMessageEvent);

    const getNodeById = useCallback((id: number, node: ICatalogNode) =>
    {
        if((node.pageId === id) && (node !== rootNode)) return node;

        for(const child of node.children)
        {
            const found = (getNodeById(id, child) as ICatalogNode);

            if(found) return found;
        }

        return null;
    }, [ rootNode ]);

    const getNodeByName = useCallback((name: string, node: ICatalogNode) =>
    {
        if((node.pageName === name) && (node !== rootNode)) return node;

        for(const child of node.children)
        {
            const found = (getNodeByName(name, child) as ICatalogNode);

            if(found) return found;
        }

        return null;
    }, [ rootNode ]);

    const getNodesByOfferId = useCallback((offerId: number, flag: boolean = false) =>
    {
        if(!offersToNodes || !offersToNodes.size) return null;

        if(flag)
        {
            const nodes: ICatalogNode[] = [];
            const offers = offersToNodes.get(offerId);

            if(offers && offers.length) for(const offer of offers) (offer.isVisible && nodes.push(offer));

            if(nodes.length) return nodes;
        }

        return offersToNodes.get(offerId);
    }, [ offersToNodes ]);

    const loadCatalogPage = useCallback((pageId: number, offerId: number) =>
    {
        if(pageId < 0) return;
        
        BatchUpdates(() =>
        {
            setIsBusy(true);
            setPageId(pageId);
        });

        if(pageId > -1) SendMessageComposer(new GetCatalogPageComposer(pageId, offerId, currentType));
    }, [ currentType ]);

    const showCatalogPage = useCallback((pageId: number, layoutCode: string, localization: IPageLocalization, offers: IPurchasableOffer[], offerId: number, acceptSeasonCurrencyAsCredits: boolean) =>
    {
        const catalogPage = (new CatalogPage(pageId, layoutCode, localization, offers, acceptSeasonCurrencyAsCredits) as ICatalogPage);

        BatchUpdates(() =>
        {
            setCurrentPage(catalogPage);
            setPreviousPageId(prevValue => ((pageId !== -1) ? pageId : prevValue));
            setNavigationHidden(false);

            if((offerId > -1) && catalogPage.offers.length)
            {
                for(const offer of catalogPage.offers)
                {
                    if(offer.offerId !== offerId) continue;
                    
                    setCurrentOffer(offer)
        
                    break;
                }
            }
        });
    }, []);

    const activateNode = useCallback((targetNode: ICatalogNode, offerId: number = -1) =>
    {
        if(targetNode.parent.pageName === 'root')
        {
            if(targetNode.children.length)
            {
                for(const child of targetNode.children)
                {
                    if(!child.isVisible) continue;

                    targetNode = child;

                    break;
                }
            }
        }

        const nodes: ICatalogNode[] = [];

        let node = targetNode;

        while(node && (node.pageName !== 'root'))
        {
            nodes.push(node);

            node = node.parent;
        }

        nodes.reverse();

        setActiveNodes(prevValue =>
            {
                const isActive = (prevValue.indexOf(targetNode) >= 0);
                const isOpen = targetNode.isOpen;

                for(const existing of prevValue)
                {
                    existing.deactivate();

                    if(nodes.indexOf(existing) === -1) existing.close();
                }

                for(const n of nodes)
                {
                    n.activate();

                    if(n.parent) n.open();

                    if((n === targetNode.parent) && n.children.length) n.open();
                }

                if(isActive && isOpen) targetNode.close();
                else targetNode.open();

                return nodes;
            });
            
        if(targetNode.pageId > -1) loadCatalogPage(targetNode.pageId, offerId);
    }, [ setActiveNodes, loadCatalogPage ]);

    const openPageById = useCallback((id: number) =>
    {
        BatchUpdates(() =>
        {
            setSearchResult(null);

            if(!isVisible)
            {
                REQUESTED_PAGE.requestById = id;

                setIsVisible(true);
            }
            else
            {
                const node = getNodeById(id, rootNode);

                if(node) activateNode(node);
            }
        });
    }, [ isVisible, rootNode, getNodeById, activateNode ]);

    const openPageByName = useCallback((name: string) =>
    {
        BatchUpdates(() =>
        {
            setSearchResult(null);

            if(!isVisible)
            {
                REQUESTED_PAGE.requestByName = name;

                setIsVisible(true);
            }
            else
            {
                const node = getNodeByName(name, rootNode);

                if(node) activateNode(node);
            }
        });
    }, [ isVisible, rootNode, getNodeByName, activateNode ]);

    const openPageByOfferId = useCallback((offerId: number) =>
    {
        BatchUpdates(() =>
        {
            setSearchResult(null);

            if(!isVisible)
            {
                REQUESTED_PAGE.requestedByOfferId = offerId;

                setIsVisible(true);
            }
            else
            {
                const nodes = getNodesByOfferId(offerId);

                if(!nodes || !nodes.length) return;

                activateNode(nodes[0], offerId);
            }
        });
    }, [ isVisible, getNodesByOfferId, activateNode ]);

    const onCatalogPurchasedEvent = useCallback((event: CatalogPurchasedEvent) =>
    {
        PlaySound(SoundNames.CREDITS);
    }, []);

    UseUiEvent(CatalogPurchasedEvent.PURCHASE_SUCCESS, onCatalogPurchasedEvent);

    const linkReceived = useCallback((url: string) =>
    {
        const parts = url.split('/');

        if(parts.length < 2) return;

        switch(parts[1])
        {
            case 'show':
                setIsVisible(true);
                return;
            case 'hide':
                setIsVisible(false);
                return;
            case 'toggle':
                setIsVisible(prevValue => !prevValue);
                return;
            case 'open':
                if(parts.length > 2)
                {
                    if(parts.length === 4)
                    {
                        switch(parts[2])
                        {
                            case 'offerId':
                                openPageByOfferId(parseInt(parts[3]));
                                return;
                        }
                    }
                    else
                    {
                        openPageByName(parts[2]);
                    }
                }
                else
                {
                    setIsVisible(true);
                }

                return;
        }
    }, [ openPageByOfferId, openPageByName ]);

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
        if(!isVisible || rootNode) return;

        SendMessageComposer(new GetGiftWrappingConfigurationComposer());
        SendMessageComposer(new GetClubGiftInfo());
        SendMessageComposer(new GetCatalogIndexComposer(currentType));
    }, [ isVisible, rootNode, currentType ]);

    useEffect(() =>
    {
        if(!isVisible || !rootNode) return;

        switch(REQUESTED_PAGE.requestType)
        {
            case RequestedPage.REQUEST_TYPE_NONE:
                if(activeNodes && activeNodes.length) return;

                if(rootNode.isBranch)
                {
                    for(const child of rootNode.children)
                    {
                        if(child && child.isVisible)
                        {
                            activateNode(child);

                            return;
                        }
                    }
                }
                return;
            case RequestedPage.REQUEST_TYPE_ID:
                openPageById(REQUESTED_PAGE.requestById);
                REQUESTED_PAGE.resetRequest();
                return;
            case RequestedPage.REQUEST_TYPE_OFFER:
                openPageByOfferId(REQUESTED_PAGE.requestedByOfferId);
                REQUESTED_PAGE.resetRequest();
                return;
            case RequestedPage.REQUEST_TYPE_NAME:
                openPageByName(REQUESTED_PAGE.requestByName);
                REQUESTED_PAGE.resetRequest();
                return;
        }
    }, [ isVisible, rootNode, activeNodes, activateNode, openPageById, openPageByOfferId, openPageByName ]);

    useEffect(() =>
    {
        if(!searchResult && currentPage && (currentPage.pageId === -1)) openPageById(previousPageId);
    }, [ searchResult, currentPage, previousPageId, openPageById ]);

    useEffect(() =>
    {
        return () => setCurrentOffer(null);
    }, [ currentPage ]);

    return (
        <CatalogContextProvider value={ { isVisible, isBusy, setIsBusy, pageId, currentType, setCurrentType, rootNode, setRootNode, offersToNodes, setOffersToNodes, currentPage, setCurrentPage, currentOffer, setCurrentOffer, activeNodes, setActiveNodes, searchResult, setSearchResult, frontPageItems, setFrontPageItems, roomPreviewer, purchaseOptions, setPurchaseOptions, catalogOptions, setCatalogOptions, resetState, getNodesByOfferId, loadCatalogPage, showCatalogPage, activateNode } }>
            <CatalogMessageHandler />
            { isVisible &&
                <NitroCardView uniqueKey="catalog" className="nitro-catalog">
                    <NitroCardHeaderView headerText={ LocalizeText('catalog.title') } onCloseClick={ event => { setIsVisible(false); } } />
                    <NitroCardTabsView>
                        { rootNode && (rootNode.children.length > 0) && rootNode.children.map(child =>
                            {
                                if(!child.isVisible) return null;

                                return (
                                    <NitroCardTabsItemView key={ child.pageId } isActive={ child.isActive } onClick={ event =>
                                        {
                                            if(searchResult) setSearchResult(null);

                                            activateNode(child);
                                        } }>
                                        { child.localization }
                                    </NitroCardTabsItemView>
                                );
                            }) }
                    </NitroCardTabsView>
                    <NitroCardContentView>
                        <Grid>
                            { !navigationHidden &&
                                <Column size={ 3 } overflow="hidden">
                                    { activeNodes && (activeNodes.length > 0) &&
                                        <CatalogNavigationView node={ activeNodes[0] } /> }
                                </Column> }
                            <Column size={ !navigationHidden ? 9 : 12 } overflow="hidden">
                                { GetCatalogLayout(currentPage, () => setNavigationHidden(true)) }
                            </Column>
                        </Grid>
                    </NitroCardContentView>
                </NitroCardView> }
                <CatalogGiftView />
                <MarketplacePostOfferView />
        </CatalogContextProvider>
    );
}
