import { BuildersClubFurniCountMessageEvent, BuildersClubPlaceRoomItemMessageComposer, BuildersClubPlaceWallItemMessageComposer, BuildersClubQueryFurniCountMessageComposer, BuildersClubSubscriptionStatusMessageEvent, CatalogPageMessageEvent, CatalogPagesListEvent, CatalogPublishedMessageEvent, ClubGiftInfoEvent, FrontPageItem, FurniturePlaceComposer, FurniturePlacePaintComposer, GetCatalogIndexComposer, GetCatalogPageComposer, GetClubGiftInfo, GetGiftWrappingConfigurationComposer, GetTickerTime, GiftWrappingConfigurationEvent, GuildMembershipsMessageEvent, HabboClubOffersMessageEvent, LegacyDataType, LimitedEditionSoldOutEvent, MarketplaceMakeOfferResult, NodeData, ProductOfferEvent, PurchaseErrorMessageEvent, PurchaseFromCatalogComposer, PurchaseNotAllowedMessageEvent, PurchaseOKMessageEvent, RoomControllerLevel, RoomEngineObjectPlacedEvent, RoomObjectCategory, RoomObjectPlacementSource, RoomObjectType, RoomObjectVariable, RoomPreviewer, SellablePetPalettesMessageEvent, Vector3d } from '@nitrots/nitro-renderer';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useBetween } from 'use-between';
import { BuilderFurniPlaceableStatus, CatalogNode, CatalogPage, CatalogPetPalette, CatalogType, CreateLinkEvent, DispatchUiEvent, FurniCategory, GetFurnitureData, GetProductDataForLocalization, GetRoomEngine, GetRoomSession, GiftWrappingConfiguration, ICatalogNode, ICatalogOptions, ICatalogPage, IPageLocalization, IProduct, IPurchasableOffer, IPurchaseOptions, LocalizeText, NotificationAlertType, Offer, PageLocalization, PlacedObjectPurchaseData, PlaySound, Product, ProductTypeEnum, RequestedPage, SearchResult, SendMessageComposer, SoundNames } from '../../api';
import { CatalogPurchasedEvent, CatalogPurchaseFailureEvent, CatalogPurchaseNotAllowedEvent, CatalogPurchaseSoldOutEvent, InventoryFurniAddedEvent } from '../../events';
import { useMessageEvent, useRoomEngineEvent, useUiEvent } from '../events';
import { useNotification } from '../notification';
import { useCatalogPlaceMultipleItems } from './useCatalogPlaceMultipleItems';
import { useCatalogSkipPurchaseConfirmation } from './useCatalogSkipPurchaseConfirmation';

const DUMMY_PAGE_ID_FOR_OFFER_SEARCH = -12345678;
const DRAG_AND_DROP_ENABLED = true;

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
    const [ objectMoverRequested, setObjectMoverRequested ] = useState(false);
    const [ catalogPlaceMultipleObjects, setCatalogPlaceMultipleObjects ] = useCatalogPlaceMultipleItems();
    const [ catalogSkipPurchaseConfirmation, setCatalogSkipPurchaseConfirmation ] = useCatalogSkipPurchaseConfirmation();
    const [ purchasableOffer, setPurchaseableOffer ] = useState<IPurchasableOffer>(null);
    const [ placedObjectPurchaseData, setPlacedObjectPurchaseData ] = useState<PlacedObjectPurchaseData>(null);
    const [ furniCount, setFurniCount ] = useState(0);
    const [ furniLimit, setFurniLimit ] = useState(0);
    const [ maxFurniLimit, setMaxFurniLimit ] = useState(0);
    const [ secondsLeft, setSecondsLeft ] = useState(0);
    const [ updateTime, setUpdateTime ] = useState(0);
    const [ secondsLeftWithGrace, setSecondsLeftWithGrace ] = useState(0);
    const { simpleAlert = null } = useNotification();
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

    const getBuilderFurniPlaceableStatus = useCallback((offer: IPurchasableOffer) =>
    {
        if(!offer) return BuilderFurniPlaceableStatus.MISSING_OFFER;

        if((furniCount < 0) || (furniCount >= furniLimit)) return BuilderFurniPlaceableStatus.FURNI_LIMIT_REACHED;

        const roomSession = GetRoomSession();

        if(!roomSession) return BuilderFurniPlaceableStatus.NOT_IN_ROOM;

        if(!roomSession.isRoomOwner) return BuilderFurniPlaceableStatus.NOT_ROOM_OWNER;

        if(secondsLeft <= 0)
        {
            const roomEngine = GetRoomEngine();

            let objectCount = roomEngine.getRoomObjectCount(roomSession.roomId, RoomObjectCategory.UNIT);

            while(objectCount > 0)
            {
                const roomObject = roomEngine.getRoomObjectByIndex(roomSession.roomId, objectCount, RoomObjectCategory.UNIT);
                const userData = roomSession.userDataManager.getUserDataByIndex(roomObject.id);

                if(userData && (userData.type === RoomObjectType.USER) && (userData.roomIndex !== roomSession.ownRoomIndex) && !userData.isModerator) return BuilderFurniPlaceableStatus.VISITORS_IN_ROOM;

                objectCount--;
            }
        }

        return BuilderFurniPlaceableStatus.OKAY;
    }, [ furniCount, furniLimit, secondsLeft ]);

    const isDraggable = useCallback((offer: IPurchasableOffer) =>
    {
        const roomSession = GetRoomSession();

        if(((DRAG_AND_DROP_ENABLED && roomSession && offer.page && (offer.page.layoutCode !== 'sold_ltd_items') && (currentType === CatalogType.NORMAL) && (roomSession.isRoomOwner || (roomSession.isGuildRoom && (roomSession.controllerLevel >= RoomControllerLevel.GUILD_MEMBER)))) || ((currentType === CatalogType.BUILDER) && (getBuilderFurniPlaceableStatus(offer) === BuilderFurniPlaceableStatus.OKAY))) && (offer.pricingModel !== Offer.PRICING_MODEL_BUNDLE) && (offer.product.productType !== ProductTypeEnum.EFFECT) && (offer.product.productType !== ProductTypeEnum.HABBO_CLUB)) return true;

        return false;
    }, [ currentType, getBuilderFurniPlaceableStatus ]);

    const requestOfferToMover = useCallback((offer: IPurchasableOffer) =>
    {
        if(!isDraggable(offer)) return;

        const product = offer.product;

        if(!product) return;

        let category = 0;

        switch(product.productType)
        {
            case ProductTypeEnum.FLOOR:
                category = RoomObjectCategory.FLOOR;
                break;
            case ProductTypeEnum.WALL:
                category = RoomObjectCategory.WALL;
                break;
        }

        if(GetRoomEngine().processRoomObjectPlacement(RoomObjectPlacementSource.CATALOG, -(offer.offerId), category, product.productClassId, product.extraParam))
        {
            setPurchaseableOffer(offer);
            setObjectMoverRequested(true);

            setIsVisible(false);
        }
    }, [ isDraggable ]);

    const resetRoomPaint = useCallback((planeType: string, type: string) =>
    {
        const roomEngine = GetRoomEngine();

        let wallType = roomEngine.getRoomInstanceVariable<string>(roomEngine.activeRoomId, RoomObjectVariable.ROOM_WALL_TYPE);
        let floorType = roomEngine.getRoomInstanceVariable<string>(roomEngine.activeRoomId, RoomObjectVariable.ROOM_FLOOR_TYPE);
        let landscapeType = roomEngine.getRoomInstanceVariable<string>(roomEngine.activeRoomId, RoomObjectVariable.ROOM_LANDSCAPE_TYPE);

        wallType = (wallType && wallType.length) ? wallType : '101';
        floorType = (floorType && floorType.length) ? floorType : '101';
        landscapeType = (landscapeType && landscapeType.length) ? landscapeType : '1.1';

        switch(planeType)
        {
            case 'floor':
                roomEngine.updateRoomInstancePlaneType(roomEngine.activeRoomId, type, wallType, landscapeType, true);
                return;
            case 'wallpaper':
                roomEngine.updateRoomInstancePlaneType(roomEngine.activeRoomId, floorType, type, landscapeType, true);
                return;
            case 'landscape':
                roomEngine.updateRoomInstancePlaneType(roomEngine.activeRoomId, floorType, wallType, type, true);
                return;
            default:
                roomEngine.updateRoomInstancePlaneType(roomEngine.activeRoomId, floorType, wallType, landscapeType, true);
                return;
        }
    }, []);

    const cancelObjectMover = useCallback(() =>
    {
        if(!purchasableOffer) return;

        GetRoomEngine().cancelRoomObjectInsert();

        setObjectMoverRequested(false);
        setPurchaseableOffer(null);
    }, [ purchasableOffer ]);

    const resetObjectMover = useCallback((flag: boolean = true) =>
    {
        setObjectMoverRequested(prevValue =>
        {
            if(prevValue && flag)
            {
                CreateLinkEvent('catalog/open');
            }

            return false;
        });
    }, []);

    const resetPlacedOfferData = useCallback((flag: boolean = false) =>
    {
        if(!flag) resetObjectMover();

        setPlacedObjectPurchaseData(prevValue =>
        {
            if(prevValue)
            {
                switch(prevValue.category)
                {
                    case RoomObjectCategory.FLOOR:
                        GetRoomEngine().removeRoomObjectFloor(prevValue.roomId, prevValue.objectId);
                        break;
                    case RoomObjectCategory.WALL: {

                        switch(prevValue.furniData.className)
                        {
                            case 'floor':
                            case 'wallpaper':
                            case 'landscape':
                                resetRoomPaint('reset', '');
                                break;
                            default:
                                GetRoomEngine().removeRoomObjectWall(prevValue.roomId, prevValue.objectId);
                                break;
                        }
                        break;
                    }
                    default:
                        GetRoomEngine().deleteRoomObject(prevValue.objectId, prevValue.category);
                        break;
                }
            }

            return null;
        });
    }, [ resetObjectMover, resetRoomPaint ]);

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
        if(id !== -1) setSearchResult(null);

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

    const refreshBuilderStatus = useCallback(() =>
    {

    }, []);

    useMessageEvent<CatalogPagesListEvent>(CatalogPagesListEvent, event =>
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
    });

    useMessageEvent<CatalogPageMessageEvent>(CatalogPageMessageEvent, event =>
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
    });

    useMessageEvent<PurchaseOKMessageEvent>(PurchaseOKMessageEvent, event =>
    {
        const parser = event.getParser();

        DispatchUiEvent(new CatalogPurchasedEvent(parser.offer));
    });

    useMessageEvent<PurchaseErrorMessageEvent>(PurchaseErrorMessageEvent, event =>
    {
        const parser = event.getParser();

        DispatchUiEvent(new CatalogPurchaseFailureEvent(parser.code));
    });

    useMessageEvent<PurchaseNotAllowedMessageEvent>(PurchaseNotAllowedMessageEvent, event =>
    {
        const parser = event.getParser();

        DispatchUiEvent(new CatalogPurchaseNotAllowedEvent(parser.code));
    });

    useMessageEvent<LimitedEditionSoldOutEvent>(LimitedEditionSoldOutEvent, event =>
    {
        const parser = event.getParser();

        DispatchUiEvent(new CatalogPurchaseSoldOutEvent());
    });

    useMessageEvent<ProductOfferEvent>(ProductOfferEvent, event =>
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
    });

    useMessageEvent<SellablePetPalettesMessageEvent>(SellablePetPalettesMessageEvent, event =>
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
    });

    useMessageEvent<HabboClubOffersMessageEvent>(HabboClubOffersMessageEvent, event =>
    {
        const parser = event.getParser();

        setCatalogOptions(prevValue =>
        {
            const clubOffers = parser.offers;

            return { ...prevValue, clubOffers };
        });
    });

    useMessageEvent<GuildMembershipsMessageEvent>(GuildMembershipsMessageEvent, event =>
    {
        const parser = event.getParser();

        setCatalogOptions(prevValue =>
        {
            const groups = parser.groups;

            return { ...prevValue, groups };
        });
    });

    useMessageEvent<GiftWrappingConfigurationEvent>(GiftWrappingConfigurationEvent, event =>
    {
        const parser = event.getParser();

        setCatalogOptions(prevValue =>
        {
            const giftConfiguration = new GiftWrappingConfiguration(parser);

            return { ...prevValue, giftConfiguration };
        });
    });

    useMessageEvent<MarketplaceMakeOfferResult>(MarketplaceMakeOfferResult, event =>
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

        simpleAlert(message, NotificationAlertType.DEFAULT, null, null, title);
    });

    useMessageEvent<ClubGiftInfoEvent>(ClubGiftInfoEvent, event =>
    {
        const parser = event.getParser();

        setCatalogOptions(prevValue =>
        {
            const clubGifts = parser;

            return { ...prevValue, clubGifts };
        });
    });

    useMessageEvent<CatalogPublishedMessageEvent>(CatalogPublishedMessageEvent, event =>
    {
        const wasVisible = isVisible;

        resetState();

        if(wasVisible) simpleAlert(LocalizeText('catalog.alert.published.description'), NotificationAlertType.ALERT, null, null, LocalizeText('catalog.alert.published.title'));
    });

    useMessageEvent<BuildersClubFurniCountMessageEvent>(BuildersClubFurniCountMessageEvent, event =>
    {
        const parser = event.getParser();

        setFurniCount(parser.furniCount);

        refreshBuilderStatus();
    });

    useMessageEvent<BuildersClubSubscriptionStatusMessageEvent>(BuildersClubSubscriptionStatusMessageEvent, event =>
    {
        const parser = event.getParser();

        setFurniLimit(parser.furniLimit);
        setMaxFurniLimit(parser.maxFurniLimit);
        setSecondsLeft(parser.secondsLeft);
        setUpdateTime(GetTickerTime());
        setSecondsLeftWithGrace(parser.secondsLeftWithGrace);

        refreshBuilderStatus();
    });

    useUiEvent<CatalogPurchasedEvent>(CatalogPurchasedEvent.PURCHASE_SUCCESS, event => PlaySound(SoundNames.CREDITS));

    useRoomEngineEvent<RoomEngineObjectPlacedEvent>(RoomEngineObjectPlacedEvent.PLACED, event =>
    {
        if(!objectMoverRequested || (event.type !== RoomEngineObjectPlacedEvent.PLACED)) return;

        resetPlacedOfferData(true);

        if(!purchasableOffer)
        {
            resetObjectMover();

            return;
        }

        let placed = false;

        const product = purchasableOffer.product;

        if(event.category === RoomObjectCategory.WALL)
        {
            switch(product.furnitureData.className)
            {
                case 'floor':
                case 'wallpaper':
                case 'landscape':
                    placed = (event.placedOnFloor || event.placedOnWall);
                    break;
                default:
                    placed = event.placedInRoom;
                    break;
            }
        }
        else
        {
            placed = event.placedInRoom;
        }

        if(!placed)
        {
            resetObjectMover();

            return;
        }

        setPlacedObjectPurchaseData(new PlacedObjectPurchaseData(event.roomId, event.objectId, event.category, event.wallLocation, event.x, event.y, event.direction, purchasableOffer));

        switch(currentType)
        {
            case CatalogType.NORMAL: {
                switch(event.category)
                {
                    case RoomObjectCategory.FLOOR:
                        GetRoomEngine().addFurnitureFloor(event.roomId, event.objectId, product.productClassId, new Vector3d(event.x, event.y, event.z), new Vector3d(event.direction), 0, new LegacyDataType());
                        break;
                    case RoomObjectCategory.WALL: {
                        switch(product.furnitureData.className)
                        {
                            case 'floor':
                            case 'wallpaper':
                            case 'landscape':
                                resetRoomPaint(product.furnitureData.className, product.extraParam);
                                break;
                            default:
                                GetRoomEngine().addFurnitureWall(event.roomId, event.objectId, product.productClassId, new Vector3d(event.x, event.y, event.z), new Vector3d(event.direction * 45), 0, event.instanceData, 0);
                                break;
                        }
                    }
                }

                const roomObject = GetRoomEngine().getRoomObject(event.roomId, event.objectId, event.category);

                if(roomObject) roomObject.model.setValue(RoomObjectVariable.FURNITURE_ALPHA_MULTIPLIER, 0.5);

                if(catalogSkipPurchaseConfirmation)
                {
                    SendMessageComposer(new PurchaseFromCatalogComposer(pageId, purchasableOffer.offerId, product.extraParam, 1));

                    if(catalogPlaceMultipleObjects) requestOfferToMover(purchasableOffer);
                }
                else
                {
                    // confirm

                    if(catalogPlaceMultipleObjects) requestOfferToMover(purchasableOffer);
                }
                break;
            }
            case CatalogType.BUILDER: {
                let pageId = purchasableOffer.page.pageId;

                if(pageId === DUMMY_PAGE_ID_FOR_OFFER_SEARCH)
                {
                    pageId = -1;
                }

                switch(event.category)
                {
                    case RoomObjectCategory.FLOOR:
                        SendMessageComposer(new BuildersClubPlaceRoomItemMessageComposer(pageId, purchasableOffer.offerId, product.extraParam, event.x, event.y, event.direction));
                        break;
                    case RoomObjectCategory.WALL:
                        SendMessageComposer(new BuildersClubPlaceWallItemMessageComposer(pageId, purchasableOffer.offerId, product.extraParam, event.wallLocation));
                        break;
                }

                if(catalogPlaceMultipleObjects) requestOfferToMover(purchasableOffer);
                break;
            }
        }
    });

    useUiEvent<InventoryFurniAddedEvent>(InventoryFurniAddedEvent.FURNI_ADDED, event =>
    {
        const roomEngine = GetRoomEngine();

        if(!placedObjectPurchaseData || (placedObjectPurchaseData.productClassId !== event.spriteId) || (placedObjectPurchaseData.roomId !== roomEngine.activeRoomId)) return;

        switch(event.category)
        {
            case FurniCategory.FLOOR: {
                const floorType = roomEngine.getRoomInstanceVariable(roomEngine.activeRoomId, RoomObjectVariable.ROOM_FLOOR_TYPE);

                if(placedObjectPurchaseData.extraParam !== floorType) SendMessageComposer(new FurniturePlacePaintComposer(event.id));
                break;
            }
            case FurniCategory.WALL_PAPER: {
                const wallType = roomEngine.getRoomInstanceVariable(roomEngine.activeRoomId, RoomObjectVariable.ROOM_WALL_TYPE);

                if(placedObjectPurchaseData.extraParam !== wallType) SendMessageComposer(new FurniturePlacePaintComposer(event.id));
                break;
            }
            case FurniCategory.LANDSCAPE: {
                const landscapeType = roomEngine.getRoomInstanceVariable(roomEngine.activeRoomId, RoomObjectVariable.ROOM_LANDSCAPE_TYPE);

                if(placedObjectPurchaseData.extraParam !== landscapeType) SendMessageComposer(new FurniturePlacePaintComposer(event.id));
                break;
            }
            default:
                SendMessageComposer(new FurniturePlaceComposer(event.id, placedObjectPurchaseData.category, placedObjectPurchaseData.wallLocation, placedObjectPurchaseData.x, placedObjectPurchaseData.y, placedObjectPurchaseData.direction));
        }

        if(!catalogPlaceMultipleObjects) resetPlacedOfferData();
    });

    useEffect(() =>
    {
        return () => setCurrentOffer(null);
    }, [ currentPage ]);

    useEffect(() =>
    {
        if(!isVisible || !rootNode || !offersToNodes || !requestedPage.current) return;

        switch(requestedPage.current.requestType)
        {
            case RequestedPage.REQUEST_TYPE_NONE:
                if(currentPage) return;

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
    }, [ isVisible, rootNode, offersToNodes, currentPage, activateNode, openPageById, openPageByOfferId, openPageByName ]);

    useEffect(() =>
    {
        if(!searchResult && currentPage && (currentPage.pageId === -1)) openPageById(previousPageId);
    }, [ searchResult, currentPage, previousPageId, openPageById ]);

    useEffect(() =>
    {
        if(!currentOffer) return;

        setPurchaseOptions({ quantity: 1, extraData: null, extraParamRequired: false, previewStuffData: null });
    }, [ currentOffer ]);

    useEffect(() =>
    {
        if(!isVisible || rootNode) return;

        SendMessageComposer(new GetGiftWrappingConfigurationComposer());
        SendMessageComposer(new GetClubGiftInfo());
        SendMessageComposer(new GetCatalogIndexComposer(currentType));
        SendMessageComposer(new BuildersClubQueryFurniCountMessageComposer());
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
