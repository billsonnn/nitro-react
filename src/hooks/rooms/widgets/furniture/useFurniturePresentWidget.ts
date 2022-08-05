import { IFurnitureData, IGetImageListener, PetFigureData, RoomEngineTriggerWidgetEvent, RoomObjectCategory, RoomObjectVariable, RoomSessionPresentEvent, TextureUtils, Vector3d } from '@nitrots/nitro-renderer';
import { useMemo, useState } from 'react';
import { useRoom } from '../../..';
import { GetRoomEngine, GetSessionDataManager, IsOwnerOfFurniture, LocalizeText, ProductTypeEnum } from '../../../../api';
import { useRoomEngineEvent, useRoomSessionManagerEvent } from '../../../events';
import { useFurniRemovedEvent } from '../../engine';

const FLOOR: string = 'floor';
const WALLPAPER: string = 'wallpaper';
const LANDSCAPE: string = 'landscape';
const POSTER: string = 'poster';

const useFurniturePresentWidgetState = () =>
{
    const [ objectId, setObjectId ] = useState(-1);
    const [ classId, setClassId ] = useState(-1);
    const [ itemType, setItemType ] = useState<string>(null);
    const [ text, setText ] = useState<string>(null);
    const [ isOwnerOfFurniture, setIsOwnerOfFurniture ] = useState(false);
    const [ senderName, setSenderName ] = useState<string>(null);
    const [ senderFigure, setSenderFigure ] = useState<string>(null);
    const [ placedItemId, setPlacedItemId ] = useState(-1);
    const [ placedItemType, setPlacedItemType ] = useState<string>(null);
    const [ placedInRoom, setPlacedInRoom ] = useState(false);
    const [ imageUrl, setImageUrl ] = useState<string>(null);
    const { roomSession = null } = useRoom();

    const onClose = () =>
    {
        setObjectId(-1);
        setClassId(-1);
        setItemType(null);
        setText(null);
        setIsOwnerOfFurniture(false);
        setSenderName(null);
        setSenderFigure(null);
        setPlacedItemId(-1);
        setPlacedItemType(null);
        setPlacedInRoom(false);
        setImageUrl(null);
    }

    const openPresent = () =>
    {
        if(objectId === -1) return;

        roomSession.openGift(objectId);
        
        GetRoomEngine().changeObjectModelData(GetRoomEngine().activeRoomId, objectId, RoomObjectCategory.FLOOR, RoomObjectVariable.FURNITURE_DISABLE_PICKING_ANIMATION, 1);
    }

    const imageListener: IGetImageListener = useMemo(() =>
    {
        return {
            imageReady: (id, texture, image) =>
            {
                if(!image && texture)
                {
                    image = TextureUtils.generateImage(texture);
                }

                setImageUrl(image.src);
            },
            imageFailed: null
        }
    }, []);

    useRoomSessionManagerEvent<RoomSessionPresentEvent>(RoomSessionPresentEvent.RSPE_PRESENT_OPENED, event =>
    {
        let furniData: IFurnitureData = null;

        if(event.itemType === ProductTypeEnum.FLOOR)
        {
            furniData = GetSessionDataManager().getFloorItemData(event.classId);
        }
        else if(event.itemType === ProductTypeEnum.WALL)
        {
            furniData = GetSessionDataManager().getWallItemData(event.classId);
        }

        let isOwnerOfFurni = false;

        if(event.placedInRoom)
        {
            const roomObject = GetRoomEngine().getRoomObject(roomSession.roomId, event.placedItemId, RoomObjectCategory.FLOOR);

            if(roomObject) isOwnerOfFurni = IsOwnerOfFurniture(roomObject);
        }

        let giftImage: string = null;

        switch(event.itemType)
        {
            case ProductTypeEnum.WALL: {
                if(furniData)
                {
                    switch(furniData.className)
                    {
                        case FLOOR:
                        case LANDSCAPE:
                        case WALLPAPER:
                            let imageType = null;
                            let message = null;

                            if(furniData.className === FLOOR)
                            {
                                imageType = 'packagecard_icon_floor';
                                message = LocalizeText('inventory.furni.item.floor.name');
                            }

                            else if(furniData.className === LANDSCAPE)
                            {
                                imageType = 'packagecard_icon_landscape';
                                message = LocalizeText('inventory.furni.item.landscape.name');
                            }

                            else
                            {
                                imageType = 'packagecard_icon_wallpaper';
                                message = LocalizeText('inventory.furni.item.wallpaper.name');
                            }
                           
                            setText(message);
                            //setImageUrl(getGiftImageUrl(imageType));
                            break;
                        case POSTER: {
                            const productCode = event.productCode;

                            let extras: string = null;

                            if(productCode.indexOf('poster') === 0) extras = productCode.replace('poster', '');

                            const productData = GetSessionDataManager().getProductData(productCode);

                            let name: string = null;

                            if(productData) name = productData.name;
                            else if(furniData) name = furniData.name;

                            setText(name);
                            setImageUrl(GetRoomEngine().getFurnitureWallIconUrl(event.classId, extras));

                            break;
                        }
                        default: {
                            setText(furniData.name || null);
                            setImageUrl(GetRoomEngine().getFurnitureWallIconUrl(event.classId));
                            break;
                        }
                    }
                }

                break;
            }
            case ProductTypeEnum.HABBO_CLUB:
                setText(LocalizeText('widget.furni.present.hc'));
                //setImageUrl(getGiftImageUrl('packagecard_icon_hc'));
                break;
            default: {
                if(event.placedItemType === ProductTypeEnum.PET)
                {
                    const petfigureString = event.petFigureString;

                    if(petfigureString && petfigureString.length)
                    {
                        const petFigureData = new PetFigureData(petfigureString);

                        const petImage = GetRoomEngine().getRoomObjectPetImage(petFigureData.typeId, petFigureData.paletteId, petFigureData.color, new Vector3d(90), 64, imageListener, true, 0, petFigureData.customParts);

                        if(petImage) setImageUrl(petImage.getImage().src);
                    }
                }
                else
                {
                    const furniImage = GetRoomEngine().getFurnitureFloorImage(event.classId, new Vector3d(90), 64, imageListener);

                    if(furniImage) setImageUrl(furniImage.getImage().src);
                }

                const productData = GetSessionDataManager().getProductData(event.productCode);

                setText((productData && productData.name) || furniData.name);
                break;
            }
        }

        setObjectId(0);
        setClassId(event.classId);
        setItemType(event.itemType);
        setIsOwnerOfFurniture(isOwnerOfFurni);
        setPlacedItemId(event.placedItemId);
        setPlacedItemType(event.placedItemType);
        setPlacedInRoom(event.placedInRoom);
    });

    useRoomEngineEvent<RoomEngineTriggerWidgetEvent>(RoomEngineTriggerWidgetEvent.REQUEST_PRESENT, event =>
    {
        const roomObject = GetRoomEngine().getRoomObject(event.roomId, event.objectId, event.category);

        if(!roomObject) return null;

        onClose();

        setObjectId(event.objectId);
        setClassId(-1);
        setText((roomObject.model.getValue<string>(RoomObjectVariable.FURNITURE_DATA) || ''));
        setIsOwnerOfFurniture(IsOwnerOfFurniture(roomObject));
        setSenderName((roomObject.model.getValue<string>(RoomObjectVariable.FURNITURE_PURCHASER_NAME) || null));
        setSenderFigure((roomObject.model.getValue<string>(RoomObjectVariable.FURNITURE_PURCHASER_FIGURE) || null));
    });

    useFurniRemovedEvent((objectId !== -1), event =>
    {
        if(event.id === objectId) onClose();

        if(event.id === placedItemId)
        {
            if(placedInRoom) setPlacedInRoom(false);
        }
    });

    return { objectId, classId, itemType, text, isOwnerOfFurniture, senderName, senderFigure, placedItemId, placedItemType, placedInRoom, imageUrl, openPresent, onClose };
}

export const useFurniturePresentWidget = useFurniturePresentWidgetState;
