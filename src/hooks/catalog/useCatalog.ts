import { ApproveNameMessageEvent, CatalogPageMessageEvent, CatalogPagesListEvent, CatalogPublishedMessageEvent, ClubGiftInfoEvent, FrontPageItem, GetCatalogIndexComposer, GetCatalogPageComposer, GetClubGiftInfo, GetGiftWrappingConfigurationComposer, GiftReceiverNotFoundEvent, GiftWrappingConfigurationEvent, GuildMembershipsMessageEvent, HabboClubOffersMessageEvent, LimitedEditionSoldOutEvent, MarketplaceMakeOfferResult, NodeData, ProductOfferEvent, PurchaseErrorMessageEvent, PurchaseNotAllowedMessageEvent, PurchaseOKMessageEvent, RoomPreviewer, SellablePetPalettesMessageEvent } from '@nitrots/nitro-renderer';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useBetween } from 'use-between';
import { CatalogNode, CatalogPage, CatalogPetPalette, CatalogType, GetFurnitureData, GetProductDataForLocalization, GetRoomEngine, GiftWrappingConfiguration, ICatalogNode, ICatalogOptions, ICatalogPage, IPageLocalization, IProduct, IPurchasableOffer, IPurchaseOptions, LocalizeText, NotificationAlertType, NotificationUtilities, Offer, PageLocalization, PlaySound, Product, ProductTypeEnum, RequestedPage, SearchResult, SendMessageComposer, SoundNames } from '../../api';
import { CatalogGiftReceiverNotFoundEvent, CatalogNameResultEvent, CatalogPurchasedEvent, CatalogPurchaseFailureEvent, CatalogPurchaseNotAllowedEvent, CatalogPurchaseSoldOutEvent } from '../../events';
import { DispatchUiEvent, UseUiEvent } from '../events';
import { UseMessageEventHook } from '../messages';
import { useCatalogBuildersClub } from './useCatalogBuildersClub';
import { useCatalogItemMover } from './useCatalogItemMover';

const useCatalogState = () =>
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
    const { furniCount = 0, furniLimit = 0, secondsLeft = 0 } = useCatalogBuildersClub();
    const { requestOfferToMover = null, cancelObjectMover = null } = useCatalogItemMover({ currentType, pageId, currentOffer, purchaseOptions }, { furniCount, furniLimit, secondsLeft });
    const requestedPage = useRef(new RequestedPage());

    const resetState = useCallback(() =>
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
    }, []);

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
        
        setIsBusy(true);
        setPageId(pageId);

        if(pageId > -1) SendMessageComposer(new GetCatalogPageComposer(pageId, offerId, currentType));
    }, [ currentType ]);

    const showCatalogPage = useCallback((pageId: number, layoutCode: string, localization: IPageLocalization, offers: IPurchasableOffer[], offerId: number, acceptSeasonCurrencyAsCredits: boolean) =>
    {
        const catalogPage = (new CatalogPage(pageId, layoutCode, localization, offers, acceptSeasonCurrencyAsCredits) as ICatalogPage);

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
    }, []);

    const activateNode = useCallback((targetNode: ICatalogNode, offerId: number = -1) =>
    {
        cancelObjectMover();

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
    }, [ setActiveNodes, loadCatalogPage, cancelObjectMover ]);

    const openPageById = useCallback((id: number) =>
    {
        setSearchResult(null);

        if(!isVisible)
        {
            requestedPage.current.requestById = id;

            setIsVisible(true);
        }
        else
        {
            const node = getNodeById(id, rootNode);

            if(node) activateNode(node);
        }
    }, [ isVisible, rootNode, getNodeById, activateNode ]);

    const openPageByName = useCallback((name: string) =>
    {
        setSearchResult(null);

        if(!isVisible)
        {
            requestedPage.current.requestByName = name;

            setIsVisible(true);
        }
        else
        {
            const node = getNodeByName(name, rootNode);

            if(node) activateNode(node);
        }
    }, [ isVisible, rootNode, getNodeByName, activateNode ]);

    const openPageByOfferId = useCallback((offerId: number) =>
    {
        setSearchResult(null);

        if(!isVisible)
        {
            requestedPage.current.requestedByOfferId = offerId;

            setIsVisible(true);
        }
        else
        {
            const nodes = getNodesByOfferId(offerId);

            if(!nodes || !nodes.length) return;

            activateNode(nodes[0], offerId);
        }
    }, [ isVisible, getNodesByOfferId, activateNode ]);

    const onCatalogPagesListEvent = useCallback((event: CatalogPagesListEvent) =>
    {
        const parser = event.getParser();
        const offers: Map<number, ICatalogNode[]> = new Map();

        const getCatalogNode = (node: NodeData, depth: number, parent: ICatalogNode) =>
        {
            const catalogNode = (new CatalogNode(node, depth, parent) as ICatalogNode);

            for(const offerId of catalogNode.offerIds)
            {
                if(offers.has(offerId)) offers.get(offerId).push(catalogNode);
                else offers.set(offerId, [ catalogNode ]);
            }

            depth++;

            for(const child of node.children) catalogNode.addChild(getCatalogNode(child, depth, catalogNode));

            return catalogNode;
        }

        setRootNode(getCatalogNode(parser.root, 0, null));
        setOffersToNodes(offers);
    }, [ setRootNode, setOffersToNodes ]);

    UseMessageEventHook(CatalogPagesListEvent, onCatalogPagesListEvent);

    const onCatalogPageMessageEvent = useCallback((event: CatalogPageMessageEvent) =>
    {
        const parser = event.getParser();

        if(parser.catalogType !== currentType) return;

        const purchasableOffers: IPurchasableOffer[] = [];

        for(const offer of parser.offers)
        {
            const products: IProduct[] = [];
            const productData = GetProductDataForLocalization(offer.localizationId);

            for(const product of offer.products)
            {
                const furnitureData = GetFurnitureData(product.furniClassId, product.productType);

                products.push(new Product(product.productType, product.furniClassId, product.extraParam, product.productCount, productData, furnitureData, product.uniqueLimitedItem, product.uniqueLimitedSeriesSize, product.uniqueLimitedItemsLeft));
            }

            if(!products.length) continue;

            const purchasableOffer = new Offer(offer.offerId, offer.localizationId, offer.rent, offer.priceCredits, offer.priceActivityPoints, offer.priceActivityPointsType, offer.giftable, offer.clubLevel, products, offer.bundlePurchaseAllowed);

            if((currentType === CatalogType.NORMAL) || ((purchasableOffer.pricingModel !== Offer.PRICING_MODEL_BUNDLE) && (purchasableOffer.pricingModel !== Offer.PRICING_MODEL_MULTI))) purchasableOffers.push(purchasableOffer);
        }

        if(parser.frontPageItems && parser.frontPageItems.length) setFrontPageItems(parser.frontPageItems);

        setIsBusy(false);

        if(pageId === parser.pageId)
        {
            showCatalogPage(parser.pageId, parser.layoutCode, new PageLocalization(parser.localization.images.concat(), parser.localization.texts.concat()), purchasableOffers, parser.offerId, parser.acceptSeasonCurrencyAsCredits);
        }
    }, [ currentType, pageId, setFrontPageItems, setIsBusy, showCatalogPage ]);

    UseMessageEventHook(CatalogPageMessageEvent, onCatalogPageMessageEvent);

    const onPurchaseOKMessageEvent = useCallback((event: PurchaseOKMessageEvent) =>
    {
        const parser = event.getParser();

        DispatchUiEvent(new CatalogPurchasedEvent(parser.offer));
    }, []);

    UseMessageEventHook(PurchaseOKMessageEvent, onPurchaseOKMessageEvent);

    const onPurchaseErrorMessageEvent = useCallback((event: PurchaseErrorMessageEvent) =>
    {
        const parser = event.getParser();

        DispatchUiEvent(new CatalogPurchaseFailureEvent(parser.code));
    }, []);

    UseMessageEventHook(PurchaseErrorMessageEvent, onPurchaseErrorMessageEvent);

    const onPurchaseNotAllowedMessageEvent = useCallback((event: PurchaseNotAllowedMessageEvent) =>
    {
        const parser = event.getParser();

        DispatchUiEvent(new CatalogPurchaseNotAllowedEvent(parser.code));
    }, []);

    UseMessageEventHook(PurchaseNotAllowedMessageEvent, onPurchaseNotAllowedMessageEvent);

    const onLimitedEditionSoldOutEvent = useCallback((event: LimitedEditionSoldOutEvent) =>
    {
        const parser = event.getParser();

        DispatchUiEvent(new CatalogPurchaseSoldOutEvent());
    }, []);

    UseMessageEventHook(LimitedEditionSoldOutEvent, onLimitedEditionSoldOutEvent);

    const onProductOfferEvent = useCallback((event: ProductOfferEvent) =>
    {
        const parser = event.getParser();
        const offerData = parser.offer;

        if(!offerData || !offerData.products.length) return;

        const offerProductData = offerData.products[0];

        if(offerProductData.uniqueLimitedItem)
        {
            // update unique
        }

        const products: IProduct[] = [];
        const productData = GetProductDataForLocalization(offerData.localizationId);

        for(const product of offerData.products)
        {
            const furnitureData = GetFurnitureData(product.furniClassId, product.productType);

            products.push(new Product(product.productType, product.furniClassId, product.extraParam, product.productCount, productData, furnitureData, product.uniqueLimitedItem, product.uniqueLimitedSeriesSize, product.uniqueLimitedItemsLeft));
        }

        const offer = new Offer(offerData.offerId, offerData.localizationId, offerData.rent, offerData.priceCredits, offerData.priceActivityPoints, offerData.priceActivityPointsType, offerData.giftable, offerData.clubLevel, products, offerData.bundlePurchaseAllowed);

        if(!((currentType === CatalogType.NORMAL) || ((offer.pricingModel !== Offer.PRICING_MODEL_BUNDLE) && (offer.pricingModel !== Offer.PRICING_MODEL_MULTI)))) return;

        offer.page = currentPage;

        setCurrentOffer(offer);

        if(offer.product && (offer.product.productType === ProductTypeEnum.WALL))
        {
            setPurchaseOptions(prevValue =>
            {
                const newValue = { ...prevValue };
    
                newValue.extraData =( offer.product.extraParam || null);
    
                return newValue;
            });
        }

        // (this._isObjectMoverRequested) && (this._purchasableOffer)
    }, [ currentType, currentPage, setCurrentOffer, setPurchaseOptions ]);

    UseMessageEventHook(ProductOfferEvent, onProductOfferEvent);

    const onSellablePetPalettesMessageEvent = useCallback((event: SellablePetPalettesMessageEvent) =>
    {
        const parser = event.getParser();
        const petPalette = new CatalogPetPalette(parser.productCode, parser.palettes.slice());

        setCatalogOptions(prevValue =>
        {
            const petPalettes = [];

            if(prevValue.petPalettes) petPalettes.push(...prevValue.petPalettes);

            for(let i = 0; i < petPalettes.length; i++)
            {
                const palette = petPalettes[i];

                if(palette.breed === petPalette.breed)
                {
                    petPalettes.splice(i, 1);

                    break;
                }
            }
                
            petPalettes.push(petPalette);

            return { ...prevValue, petPalettes };
        });
    }, [ setCatalogOptions ]);

    UseMessageEventHook(SellablePetPalettesMessageEvent, onSellablePetPalettesMessageEvent);

    const onApproveNameMessageEvent = useCallback((event: ApproveNameMessageEvent) =>
    {
        const parser = event.getParser();

        DispatchUiEvent(new CatalogNameResultEvent(parser.result, parser.validationInfo));
    }, []);

    UseMessageEventHook(ApproveNameMessageEvent, onApproveNameMessageEvent);

    const onGiftReceiverNotFoundEvent = useCallback(() =>
    {
        DispatchUiEvent(new CatalogGiftReceiverNotFoundEvent());
    }, []);

    UseMessageEventHook(GiftReceiverNotFoundEvent, onGiftReceiverNotFoundEvent);

    const onHabboClubOffersMessageEvent = useCallback((event: HabboClubOffersMessageEvent) =>
    {
        const parser = event.getParser();

        setCatalogOptions(prevValue =>
        {
            const clubOffers = parser.offers;

            return { ...prevValue, clubOffers };
        });
    }, [ setCatalogOptions ]);

    UseMessageEventHook(HabboClubOffersMessageEvent, onHabboClubOffersMessageEvent);

    const onGuildMembershipsMessageEvent = useCallback((event: GuildMembershipsMessageEvent) =>
    {
        const parser = event.getParser();

        setCatalogOptions(prevValue =>
        {
            const groups = parser.groups;

            return { ...prevValue, groups };
        });
    }, [ setCatalogOptions ]);

    UseMessageEventHook(GuildMembershipsMessageEvent, onGuildMembershipsMessageEvent);

    const onGiftWrappingConfigurationEvent = useCallback((event: GiftWrappingConfigurationEvent) =>
    {
        const parser = event.getParser();

        setCatalogOptions(prevValue =>
        {
            const giftConfiguration = new GiftWrappingConfiguration(parser);

            return { ...prevValue, giftConfiguration };
        });
    }, [ setCatalogOptions ]);

    UseMessageEventHook(GiftWrappingConfigurationEvent, onGiftWrappingConfigurationEvent);

    const onMarketplaceMakeOfferResult = useCallback((event: MarketplaceMakeOfferResult) =>
    {
        const parser = event.getParser();

        if(!parser) return;

        let title = '';
        if(parser.result === 1)
        {
            title = LocalizeText('inventory.marketplace.result.title.success');
        }
        else
        {
            title = LocalizeText('inventory.marketplace.result.title.failure');
        }

        const message = LocalizeText(`inventory.marketplace.result.${ parser.result }`);
        
        NotificationUtilities.simpleAlert(message, NotificationAlertType.DEFAULT, null, null, title);
    }, []);

    UseMessageEventHook(MarketplaceMakeOfferResult, onMarketplaceMakeOfferResult);

    const onClubGiftInfoEvent = useCallback((event: ClubGiftInfoEvent) =>
    {
        const parser = event.getParser();

        setCatalogOptions(prevValue =>
        {
            const clubGifts = parser;

            return { ...prevValue, clubGifts };
        });
    }, [ setCatalogOptions ]);

    UseMessageEventHook(ClubGiftInfoEvent, onClubGiftInfoEvent);

    const onCatalogPublishedMessageEvent = useCallback((event: CatalogPublishedMessageEvent) =>
    {
        const wasVisible = isVisible;

        resetState();

        if(wasVisible) NotificationUtilities.simpleAlert(LocalizeText('catalog.alert.published.description'), NotificationAlertType.ALERT, null, null, LocalizeText('catalog.alert.published.title'));
    }, [ isVisible, resetState ]);

    UseMessageEventHook(CatalogPublishedMessageEvent, onCatalogPublishedMessageEvent);

    const onCatalogPurchasedEvent = useCallback((event: CatalogPurchasedEvent) =>
    {
        PlaySound(SoundNames.CREDITS);
    }, []);

    UseUiEvent(CatalogPurchasedEvent.PURCHASE_SUCCESS, onCatalogPurchasedEvent);

    useEffect(() =>
    {
        return () => setCurrentOffer(null);
    }, [ currentPage ]);
    
    useEffect(() =>
    {
        if(!isVisible || !rootNode || !requestedPage.current) return;

        switch(requestedPage.current.requestType)
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
                openPageById(requestedPage.current.requestById);
                requestedPage.current.resetRequest();
                return;
            case RequestedPage.REQUEST_TYPE_OFFER:
                openPageByOfferId(requestedPage.current.requestedByOfferId);
                requestedPage.current.resetRequest();
                return;
            case RequestedPage.REQUEST_TYPE_NAME:
                openPageByName(requestedPage.current.requestByName);
                requestedPage.current.resetRequest();
                return;
        }
    }, [ isVisible, rootNode, activeNodes, activateNode, openPageById, openPageByOfferId, openPageByName ]);

    useEffect(() =>
    {
        if(!searchResult && currentPage && (currentPage.pageId === -1)) openPageById(previousPageId);
    }, [ searchResult, currentPage, previousPageId, openPageById ]);
    
    useEffect(() =>
    {
        if(!isVisible || rootNode) return;

        SendMessageComposer(new GetGiftWrappingConfigurationComposer());
        SendMessageComposer(new GetClubGiftInfo());
        SendMessageComposer(new GetCatalogIndexComposer(currentType));
    }, [ isVisible, rootNode, currentType ]);

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

    return { isVisible, setIsVisible, isBusy, pageId, previousPageId, currentType, rootNode, offersToNodes, currentPage, setCurrentPage, currentOffer, setCurrentOffer, activeNodes, searchResult, setSearchResult, frontPageItems, roomPreviewer, navigationHidden, setNavigationHidden, purchaseOptions, setPurchaseOptions, catalogOptions, setCatalogOptions, getNodeById, getNodeByName, activateNode, openPageById, openPageByName, openPageByOfferId, requestOfferToMover };
}

export const useCatalog = () => useBetween(useCatalogState);
