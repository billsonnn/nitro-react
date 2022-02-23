import { IFurnitureData, IGetImageListener, NitroEvent, NitroRenderTexture, PetFigureData, RoomObjectCategory, RoomObjectVariable, RoomSessionPresentEvent, RoomWidgetEnum, TextureUtils, Vector3d } from '@nitrots/nitro-renderer';
import { GetSessionDataManager, IsOwnerOfFurniture } from '../../..';
import { GetRoomEngine, LocalizeText } from '../../../..';
import { ProductTypeEnum } from '../../../../../components/catalog/common/ProductTypeEnum';
import { RoomWidgetUpdateEvent, RoomWidgetUpdatePresentDataEvent } from '../events';
import { RoomWidgetFurniToWidgetMessage, RoomWidgetPresentOpenMessage } from '../messages';
import { RoomWidgetMessage } from '../messages/RoomWidgetMessage';
import { RoomWidgetHandler } from './RoomWidgetHandler';

export class FurniturePresentWidgetHandler extends RoomWidgetHandler implements IGetImageListener
{
    private static FLOOR: string       = 'floor';
    private static WALLPAPER: string   = 'wallpaper';
    private static LANDSCAPE: string   = 'landscape';
    private static POSTER: string      = 'poster';

    private _lastFurniId: number = -1;
    private _name: string = null;

    public processEvent(event: NitroEvent): void
    {
        switch(event.type)
        {
            case RoomSessionPresentEvent.RSPE_PRESENT_OPENED: {
                const presentEvent = (event as RoomSessionPresentEvent);

                let furniData: IFurnitureData = null;

                if(presentEvent.itemType === ProductTypeEnum.FLOOR)
                {
                    furniData = GetSessionDataManager().getFloorItemData(presentEvent.classId);
                }
                else if(presentEvent.itemType === ProductTypeEnum.WALL)
                {
                    furniData = GetSessionDataManager().getWallItemData(presentEvent.classId);
                }

                let isOwnerOfFurni = false;

                if(presentEvent.placedInRoom)
                {
                    const roomObject = GetRoomEngine().getRoomObject(this.container.roomSession.roomId, presentEvent.placedItemId, RoomObjectCategory.FLOOR);

                    if(roomObject) isOwnerOfFurni = IsOwnerOfFurniture(roomObject);
                }

                let giftImage: string = null;
                let dataUpdateEvent: RoomWidgetUpdatePresentDataEvent = null;

                switch(presentEvent.itemType)
                {
                    case ProductTypeEnum.WALL: {
                        if(furniData)
                        {
                            switch(furniData.className)
                            {
                                case FurniturePresentWidgetHandler.FLOOR:
                                    dataUpdateEvent = new RoomWidgetUpdatePresentDataEvent(RoomWidgetUpdatePresentDataEvent.CONTENTS_FLOOR, 0, LocalizeText('inventory.furni.item.floor.name'), isOwnerOfFurni);
                                    break;
                                case FurniturePresentWidgetHandler.LANDSCAPE:
                                    dataUpdateEvent = new RoomWidgetUpdatePresentDataEvent(RoomWidgetUpdatePresentDataEvent.CONTENTS_LANDSCAPE, 0, LocalizeText('inventory.furni.item.landscape.name'), isOwnerOfFurni);
                                    break;
                                case FurniturePresentWidgetHandler.WALLPAPER:
                                    dataUpdateEvent = new RoomWidgetUpdatePresentDataEvent(RoomWidgetUpdatePresentDataEvent.CONTENTS_WALLPAPER, 0, LocalizeText('inventory.furni.item.wallpaper.name'), isOwnerOfFurni);
                                    break;
                                case FurniturePresentWidgetHandler.POSTER: {
                                    const productCode = presentEvent.productCode;

                                    let extras: string = null;

                                    if(productCode.indexOf('poster') === 0) extras = productCode.replace('poster', '');

                                    giftImage = GetRoomEngine().getFurnitureWallIconUrl(presentEvent.classId, extras);

                                    const productData = GetSessionDataManager().getProductData(productCode);

                                    if(productData) this._name = productData.name;
                                    else if(furniData) this._name = furniData.name;

                                    dataUpdateEvent = new RoomWidgetUpdatePresentDataEvent(RoomWidgetUpdatePresentDataEvent.CONTENTS, 0, this._name, isOwnerOfFurni, giftImage);

                                    break;
                                }
                                default: {
                                    giftImage = GetRoomEngine().getFurnitureWallIconUrl(presentEvent.classId);

                                    if(furniData) this._name = furniData.name;
                                    
                                    dataUpdateEvent = new RoomWidgetUpdatePresentDataEvent(RoomWidgetUpdatePresentDataEvent.CONTENTS, 0, this._name, isOwnerOfFurni, giftImage);
                                    break;
                                }
                            }
                        }

                        break;
                    }
                    case ProductTypeEnum.HABBO_CLUB:
                        dataUpdateEvent = new RoomWidgetUpdatePresentDataEvent(RoomWidgetUpdatePresentDataEvent.CONTENTS_CLUB, 0, LocalizeText('widget.furni.present.hc'), false);
                        break;
                    default: {
                        if(presentEvent.placedItemType === ProductTypeEnum.PET)
                        {
                            const petfigureString = presentEvent.petFigureString;

                            if(petfigureString && petfigureString.length)
                            {
                                const petFigureData = new PetFigureData(petfigureString);

                                const petImage = GetRoomEngine().getRoomObjectPetImage(petFigureData.typeId, petFigureData.paletteId, petFigureData.color, new Vector3d(90), 64, this, true, 0, petFigureData.customParts);

                                if(petImage) giftImage = petImage.getImage().src;
                            }
                        }

                        if(!giftImage)
                        {
                            const furniImage = GetRoomEngine().getFurnitureFloorImage(presentEvent.classId, new Vector3d(90), 64, this);

                            if(furniImage) giftImage = furniImage.getImage().src;
                        }

                        const productData = GetSessionDataManager().getProductData(presentEvent.productCode);

                        if(productData) this._name = productData.name;
                        else this._name = furniData.name;

                        if(giftImage) dataUpdateEvent = new RoomWidgetUpdatePresentDataEvent(RoomWidgetUpdatePresentDataEvent.CONTENTS, 0, this._name, isOwnerOfFurni, giftImage);

                        break;
                    }
                }

                if(dataUpdateEvent)
                {
                    dataUpdateEvent.classId = presentEvent.classId;
                    dataUpdateEvent.itemType = presentEvent.itemType;
                    dataUpdateEvent.placedItemId = presentEvent.placedItemId;
                    dataUpdateEvent.placedInRoom = presentEvent.placedInRoom;
                    dataUpdateEvent.placedItemType = presentEvent.placedItemType;

                    this.container.eventDispatcher.dispatchEvent(dataUpdateEvent);
                }

                return;
            }
        }
    }

    public processWidgetMessage(message: RoomWidgetMessage): RoomWidgetUpdateEvent
    {
        switch(message.type)
        {
            case RoomWidgetFurniToWidgetMessage.REQUEST_PRESENT: {
                const widgetMessage = (message as RoomWidgetFurniToWidgetMessage);

                const roomObject = GetRoomEngine().getRoomObject(widgetMessage.roomId, widgetMessage.objectId, widgetMessage.category);

                if(!roomObject) return null;

                this._lastFurniId = widgetMessage.objectId;

                const giftMessage = (roomObject.model.getValue<string>(RoomObjectVariable.FURNITURE_DATA) || '');
                const purchaserName = roomObject.model.getValue<string>(RoomObjectVariable.FURNITURE_PURCHASER_NAME);
                const purchaserFigure = roomObject.model.getValue<string>(RoomObjectVariable.FURNITURE_PURCHASER_FIGURE);
                const typeId = roomObject.model.getValue<number>(RoomObjectVariable.FURNITURE_TYPE_ID);
                const extras = roomObject.model.getValue<string>(RoomObjectVariable.FURNITURE_EXTRAS);
                const giftImage = GetRoomEngine().getFurnitureFloorImage(typeId, new Vector3d(180), 64, null, 0, extras);

                this.container.eventDispatcher.dispatchEvent(new RoomWidgetUpdatePresentDataEvent(RoomWidgetUpdatePresentDataEvent.PACKAGEINFO, widgetMessage.objectId, giftMessage, IsOwnerOfFurniture(roomObject), giftImage.getImage().src, purchaserName, purchaserFigure));

                break;
            }
            case RoomWidgetPresentOpenMessage.OPEN_PRESENT: {
                const openMessage = (message as RoomWidgetPresentOpenMessage);

                if(openMessage.objectId !== this._lastFurniId) return null;

                this.container.roomSession.openGift(openMessage.objectId);
                
                GetRoomEngine().changeObjectModelData(GetRoomEngine().activeRoomId, openMessage.objectId, RoomObjectCategory.FLOOR, RoomObjectVariable.FURNITURE_DISABLE_PICKING_ANIMATION, 1);

                break;
            }
        }

        return null;
    }

    public imageReady(id: number, texture: NitroRenderTexture, image: HTMLImageElement = null): void
    {
        let imageUrl: string = null;

        if(image) imageUrl = image.src;
        else if(texture) imageUrl = TextureUtils.generateImageUrl(texture);

        this.container.eventDispatcher.dispatchEvent(new RoomWidgetUpdatePresentDataEvent(RoomWidgetUpdatePresentDataEvent.CONTENTS_IMAGE, 0, this._name, false, imageUrl));
    }

    public imageFailed(id: number): void
    {
        
    }

    public get type(): string
    {
        return RoomWidgetEnum.FURNI_PRESENT_WIDGET;
    }

    public get eventTypes(): string[]
    {
        return [
            RoomSessionPresentEvent.RSPE_PRESENT_OPENED
        ];
    }

    public get messageTypes(): string[]
    {
        return [
            RoomWidgetFurniToWidgetMessage.REQUEST_PRESENT,
            RoomWidgetPresentOpenMessage.OPEN_PRESENT
        ];
    }
}
