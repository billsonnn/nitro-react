import { RoomObjectCategory, RoomObjectOperationType } from '@nitrots/nitro-renderer';
import { FC, useCallback, useMemo, useState } from 'react';
import { CreateLinkEvent, GetRoomEngine, GetSessionDataManager, LocalizeText, RoomWidgetPresentOpenMessage, RoomWidgetUpdatePresentDataEvent, RoomWidgetUpdateRoomObjectEvent } from '../../../../../api';
import { Button, Column, Flex, Text } from '../../../../../common';
import { ProductTypeEnum } from '../../../../../components/catalog/common/ProductTypeEnum';
import { BatchUpdates } from '../../../../../hooks';
import { CreateEventDispatcherHook } from '../../../../../hooks/events/event-dispatcher.base';
import { NitroCardContentView, NitroCardHeaderView, NitroCardView, NitroLayoutGiftCardView } from '../../../../../layout';
import { useRoomContext } from '../../../context/RoomContext';

const FLOOR: string = 'floor';
const WALLPAPER: string = 'wallpaper';
const LANDSCAPE: string = 'landscape';

const ACTION_GIVE_GIFT = 0;
const ACTION_OPEN = 1;
const ACTION_PLACE = 2;
const ACTION_INVENTORY = 3;

export const FurnitureGiftOpeningView: FC<{}> = props =>
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
    const [ openRequested, setOpenRequested ] = useState(false);
    const { roomSession = null, eventDispatcher = null, widgetHandler = null } = useRoomContext();

    const clearGift = useCallback(() =>
    {
        if(!openRequested) setObjectId(-1);

        setText(null);
        setIsOwnerOfFurniture(false);
    }, [ openRequested ]);

    const getGiftImageUrl = useCallback((name: string) =>
    {
        return '';
    }, []);

    const onRoomWidgetUpdatePresentDataEvent = useCallback((event: RoomWidgetUpdatePresentDataEvent) =>
    {
        switch(event.type)
        {
            case RoomWidgetUpdatePresentDataEvent.PACKAGEINFO: {
                BatchUpdates(() =>
                {
                    setOpenRequested(false);
                    setObjectId(event.objectId);
                    setText(event.giftMessage);
                    setIsOwnerOfFurniture(event.isController);
                    setSenderName(event.purchaserName);
                    setSenderFigure(event.purchaserFigure);
                    setImageUrl(event.imageUrl);
                });
                return;
            }
            case RoomWidgetUpdatePresentDataEvent.CONTENTS_FLOOR:
            case RoomWidgetUpdatePresentDataEvent.CONTENTS_LANDSCAPE:
            case RoomWidgetUpdatePresentDataEvent.CONTENTS_WALLPAPER: {
                let imageType: string = null;

                if(event.type === RoomWidgetUpdatePresentDataEvent.CONTENTS_FLOOR) imageType = 'packagecard_icon_floor';
                else if(event.type === RoomWidgetUpdatePresentDataEvent.CONTENTS_LANDSCAPE) imageType = 'packagecard_icon_landscape';
                else if(event.type === RoomWidgetUpdatePresentDataEvent.CONTENTS_WALLPAPER) imageType = 'packagecard_icon_wallpaper';

                BatchUpdates(() =>
                {
                    setObjectId(event.objectId);
                    setClassId(event.classId);
                    setItemType(event.itemType);
                    setText(event.giftMessage);
                    setIsOwnerOfFurniture(event.isController);
                    setPlacedItemId(event.placedItemId);
                    setPlacedItemType(event.placedItemType);
                    setPlacedInRoom(event.placedInRoom);
                    setImageUrl(getGiftImageUrl(imageType));
                });
                return;
            }
            case RoomWidgetUpdatePresentDataEvent.CONTENTS_CLUB: {
                BatchUpdates(() =>
                {
                    setObjectId(event.objectId);
                    setClassId(event.classId);
                    setItemType(event.itemType);
                    setText(event.giftMessage);
                    setIsOwnerOfFurniture(event.isController);
                    setImageUrl(getGiftImageUrl('packagecard_icon_hc'));
                });
                return;
            }
            case RoomWidgetUpdatePresentDataEvent.CONTENTS: {
                if(!openRequested) return;

                BatchUpdates(() =>
                {
                    setObjectId(event.objectId);
                    setClassId(event.classId);
                    setItemType(event.itemType);
                    setText(event.giftMessage);
                    setIsOwnerOfFurniture(event.isController);
                    setPlacedItemId(event.placedItemId);
                    setPlacedItemType(event.placedItemType);
                    setPlacedInRoom(event.placedInRoom);
                    setImageUrl(event.imageUrl);
                });
                return;
            }
            case RoomWidgetUpdatePresentDataEvent.CONTENTS_IMAGE: {
                if(!openRequested) return;

                setImageUrl(event.imageUrl);
            }
        }
    }, [ openRequested, getGiftImageUrl ]);

    CreateEventDispatcherHook(RoomWidgetUpdatePresentDataEvent.PACKAGEINFO, eventDispatcher, onRoomWidgetUpdatePresentDataEvent);
    CreateEventDispatcherHook(RoomWidgetUpdatePresentDataEvent.CONTENTS, eventDispatcher, onRoomWidgetUpdatePresentDataEvent);
    CreateEventDispatcherHook(RoomWidgetUpdatePresentDataEvent.CONTENTS_FLOOR, eventDispatcher, onRoomWidgetUpdatePresentDataEvent);
    CreateEventDispatcherHook(RoomWidgetUpdatePresentDataEvent.CONTENTS_LANDSCAPE, eventDispatcher, onRoomWidgetUpdatePresentDataEvent);
    CreateEventDispatcherHook(RoomWidgetUpdatePresentDataEvent.CONTENTS_WALLPAPER, eventDispatcher, onRoomWidgetUpdatePresentDataEvent);
    CreateEventDispatcherHook(RoomWidgetUpdatePresentDataEvent.CONTENTS_CLUB, eventDispatcher, onRoomWidgetUpdatePresentDataEvent);
    CreateEventDispatcherHook(RoomWidgetUpdatePresentDataEvent.CONTENTS_IMAGE, eventDispatcher, onRoomWidgetUpdatePresentDataEvent);

    const onRoomWidgetRoomObjectUpdateEvent = useCallback((event: RoomWidgetUpdateRoomObjectEvent) =>
    {
        if(event.id === objectId) clearGift();

        if(event.id === placedItemId)
        {
            if(placedInRoom) setPlacedInRoom(false);
        }
    }, [ objectId, placedItemId, placedInRoom, clearGift ]);

    CreateEventDispatcherHook(RoomWidgetUpdateRoomObjectEvent.FURNI_REMOVED, eventDispatcher, onRoomWidgetRoomObjectUpdateEvent);

    const close = useCallback(() =>
    {
        BatchUpdates(() =>
        {
            setObjectId(-1);
            setOpenRequested(false);
            setPlacedItemId(-1);
            setPlacedInRoom(false);
            setText(null);
            setIsOwnerOfFurniture(false);
        });
    }, []);

    const isSpaces = useMemo(() =>
    {
        if(itemType !== ProductTypeEnum.WALL) return false;

        const furniData = GetSessionDataManager().getWallItemData(classId);

        if(!furniData) return false;

        const className = furniData.className;

        return (className === FLOOR || className === LANDSCAPE || className === WALLPAPER);
    }, [ classId, itemType ]);

    const productName = useMemo(() =>
    {
        if(objectId === -1) return '';

        if(isSpaces) return 'widget.furni.present.spaces.message_opened';
        
        return 'widget.furni.present.message_opened';
    }, [ objectId, isSpaces ]);

    const handleAction = useCallback((action: number) =>
    {
        switch(action)
        {
            case ACTION_GIVE_GIFT:
                CreateLinkEvent('catalog/open');
                return;
            case ACTION_OPEN:
                setOpenRequested(true);
                widgetHandler.processWidgetMessage(new RoomWidgetPresentOpenMessage(RoomWidgetPresentOpenMessage.OPEN_PRESENT, objectId));
                return;
            case ACTION_PLACE:
                return;
            case ACTION_INVENTORY:
                if((placedItemId > 0) && placedInRoom)
                {
                    if(placedItemType === ProductTypeEnum.PET)
                    {
                        roomSession.pickupPet(placedItemId);
                    }
                    else
                    {
                        const roomObject = GetRoomEngine().getRoomObject(roomSession.roomId, placedItemId, RoomObjectCategory.FLOOR);

                        if(roomObject) GetRoomEngine().processRoomObjectOperation(roomObject.id, RoomObjectCategory.FLOOR, RoomObjectOperationType.OBJECT_PICKUP);
                    }
                }

                close();
                return;
        }
    }, [ roomSession, widgetHandler, objectId, placedInRoom, placedItemId, placedItemType, close ]);

    if(objectId === -1) return null;

    return (
        <NitroCardView className="nitro-gift-opening" simple={ true }>
            <NitroCardHeaderView headerText={ LocalizeText(senderName ? 'widget.furni.present.window.title_from' : 'widget.furni.present.window.title', [ 'name' ], [ senderName ]) } onCloseClick={ close } />
            <NitroCardContentView center>
                { (placedItemId === -1) &&
                    <Column overflow="hidden">
                        <Flex center overflow="auto">
                            <NitroLayoutGiftCardView userName={ senderName } figure={ senderFigure } message={ text } />
                        </Flex>
                        <Flex gap={ 1 }>
                            { senderName &&
                                <Button fullWidth onClick={ event => handleAction(ACTION_GIVE_GIFT) }>
                                    { LocalizeText('widget.furni.present.give_gift', [ 'name' ], [ senderName ]) }
                                </Button> }
                            <Button fullWidth variant="success" onClick={ event => handleAction(ACTION_OPEN) }>
                                { LocalizeText('widget.furni.present.open_gift') }
                            </Button>
                        </Flex>
                    </Column> }
                { (placedItemId > -1) &&
                    <Column overflow="hidden">
                        <Flex center overflow="auto" gap={ 2 }>
                            <img src={ imageUrl } className="no-select" alt="" />
                            <Text wrap>{ LocalizeText(productName, [ 'product' ], [ text ]) }</Text>
                        </Flex>
                        <Column grow gap={ 1 }>
                            <Flex gap={ 1 }>
                                <Button fullWidth onClick={ event => handleAction(ACTION_INVENTORY) }>
                                    { LocalizeText('widget.furni.present.put_in_inventory') }
                                </Button>
                                <Button fullWidth variant="success" onClick={ event => handleAction(ACTION_PLACE) }>
                                    { LocalizeText(placedInRoom ? 'widget.furni.present.keep_in_room' : 'widget.furni.present.place_in_room') }
                                </Button>
                            </Flex>
                            { (senderName && senderName.length) &&
                                <Button fullWidth onClick={ event => handleAction(ACTION_GIVE_GIFT) }>
                                    { LocalizeText('widget.furni.present.give_gift', [ 'name' ], [ senderName ]) }
                                </Button> }
                        </Column>
                    </Column> }
            </NitroCardContentView>
        </NitroCardView>
    );
}
