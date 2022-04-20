import { BuildersClubPlaceRoomItemMessageComposer, BuildersClubPlaceWallItemMessageComposer, FurniturePlaceComposer, FurniturePlacePaintComposer, LegacyDataType, PurchaseFromCatalogComposer, RoomControllerLevel, RoomEngineObjectPlacedEvent, RoomObjectCategory, RoomObjectPlacementSource, RoomObjectType, RoomObjectVariable, Vector3d } from '@nitrots/nitro-renderer';
import { useCallback, useState } from 'react';
import { BuilderFurniPlaceableStatus, CatalogType, CreateLinkEvent, FurniCategory, GetRoomEngine, GetRoomSession, IPurchasableOffer, IPurchaseOptions, Offer, PlacedObjectPurchaseData, ProductTypeEnum, SendMessageComposer } from '../../api';
import { InventoryFurniAddedEvent } from '../../events';
import { UseRoomEngineEvent, UseUiEvent } from '../events';
import { useCatalogPlaceMultipleItems } from './useCatalogPlaceMultipleItems';
import { useCatalogSkipPurchaseConfirmation } from './useCatalogSkipPurchaseConfirmation';

const DUMMY_PAGE_ID_FOR_OFFER_SEARCH = -12345678;
const DRAG_AND_DROP_ENABLED = true;

const useCatalogItemMoverState = (catalog: { currentType: string, pageId: number, currentOffer: IPurchasableOffer, purchaseOptions: IPurchaseOptions }, buildersClub: { furniCount: number, furniLimit: number, secondsLeft: number }) =>
{
    const [ objectMoverRequested, setObjectMoverRequested ] = useState(false);
    const [ catalogPlaceMultipleObjects, setCatalogPlaceMultipleObjects ] = useCatalogPlaceMultipleItems();
    const [ catalogSkipPurchaseConfirmation, setCatalogSkipPurchaseConfirmation ] = useCatalogSkipPurchaseConfirmation();
    const [ purchasableOffer, setPurchaseableOffer ] = useState<IPurchasableOffer>(null);
    const [ placedObjectPurchaseData, setPlacedObjectPurchaseData ] = useState<PlacedObjectPurchaseData>(null);

    const getBuilderFurniPlaceableStatus = useCallback((offer: IPurchasableOffer) =>
    {
        if(!offer) return BuilderFurniPlaceableStatus.MISSING_OFFER;

        if((buildersClub.furniCount < 0) || (buildersClub.furniCount >= buildersClub.furniLimit)) return BuilderFurniPlaceableStatus.FURNI_LIMIT_REACHED;

        const roomSession = GetRoomSession();

        if(!roomSession) return BuilderFurniPlaceableStatus.NOT_IN_ROOM;

        if(!roomSession.isRoomOwner) return BuilderFurniPlaceableStatus.NOT_ROOM_OWNER;

        if(buildersClub.secondsLeft <= 0)
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
    }, [ buildersClub.furniCount, buildersClub.furniLimit, buildersClub.secondsLeft ]);

    const isDraggable = useCallback((offer: IPurchasableOffer) =>
    {
        const roomSession = GetRoomSession();

        if(((DRAG_AND_DROP_ENABLED && roomSession && offer.page && (offer.page.layoutCode !== 'sold_ltd_items') && (catalog.currentType === CatalogType.NORMAL) && (roomSession.isRoomOwner || (roomSession.isGuildRoom && (roomSession.controllerLevel >= RoomControllerLevel.GUILD_MEMBER)))) || ((catalog.currentType === CatalogType.BUILDER) && (getBuilderFurniPlaceableStatus(offer) === BuilderFurniPlaceableStatus.OKAY))) && (offer.pricingModel !== Offer.PRICING_MODEL_BUNDLE) && (offer.product.productType !== ProductTypeEnum.EFFECT) && (offer.product.productType !== ProductTypeEnum.HABBO_CLUB)) return true;

        return false;
    }, [ catalog.currentType, getBuilderFurniPlaceableStatus ]);

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

            CreateLinkEvent('catalog/hide');
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

    const onRoomEngineObjectPlacedEvent = useCallback((event: RoomEngineObjectPlacedEvent) =>
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

        switch(catalog.currentType)
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

                SendMessageComposer(new PurchaseFromCatalogComposer(catalog.pageId, purchasableOffer.offerId, product.extraParam, 1));

                if(catalogPlaceMultipleObjects) requestOfferToMover(purchasableOffer);
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
    }, [ objectMoverRequested, purchasableOffer, catalogPlaceMultipleObjects, catalog, resetPlacedOfferData, resetObjectMover, resetRoomPaint, requestOfferToMover ]);

    UseRoomEngineEvent(RoomEngineObjectPlacedEvent.PLACED, onRoomEngineObjectPlacedEvent);

    const onInventoryFurniAddedEvent = useCallback((event: InventoryFurniAddedEvent) =>
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
    }, [ placedObjectPurchaseData, catalogPlaceMultipleObjects, resetPlacedOfferData ]);

    UseUiEvent(InventoryFurniAddedEvent.FURNI_ADDED, onInventoryFurniAddedEvent);

    return { requestOfferToMover, cancelObjectMover };
}

export const useCatalogItemMover = useCatalogItemMoverState;
