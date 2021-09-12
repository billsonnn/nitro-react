import { FC, useCallback, useMemo, useState } from 'react';
import { CreateLinkEvent, GetSessionDataManager, LocalizeText, RoomWidgetPresentOpenMessage, RoomWidgetRoomObjectUpdateEvent, RoomWidgetUpdatePresentDataEvent } from '../../../../../api';
import { CreateEventDispatcherHook } from '../../../../../hooks/events/event-dispatcher.base';
import { NitroCardContentView, NitroCardHeaderView, NitroCardView, NitroLayoutGiftCardView } from '../../../../../layout';
import { ProductTypeEnum } from '../../../../catalog/common/ProductTypeEnum';
import { useRoomContext } from '../../../context/RoomContext';

const FLOOR: string = 'floor';
const WALLPAPER: string = 'wallpaper';
const LANDSCAPE: string = 'landscape';

export const FurnitureGiftOpeningView: FC<{}> = props =>
{
    const { eventDispatcher = null, widgetHandler = null } = useRoomContext();
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
                setOpenRequested(false);
                setObjectId(event.objectId);
                setText(event.giftMessage);
                setIsOwnerOfFurniture(event.isController);
                setSenderName(event.purchaserName);
                setSenderFigure(event.purchaserFigure);
                setImageUrl(event.imageUrl);
                return;
            }
            case RoomWidgetUpdatePresentDataEvent.CONTENTS_FLOOR:
            case RoomWidgetUpdatePresentDataEvent.CONTENTS_LANDSCAPE:
            case RoomWidgetUpdatePresentDataEvent.CONTENTS_WALLPAPER: {
                setObjectId(event.objectId);
                setClassId(event.classId);
                setItemType(event.itemType);
                setText(event.giftMessage);
                setIsOwnerOfFurniture(event.isController);
                setPlacedItemId(event.placedItemId);
                setPlacedItemType(event.placedItemType);
                setPlacedInRoom(event.placedInRoom);

                let imageType: string = null;

                if(event.type === RoomWidgetUpdatePresentDataEvent.CONTENTS_FLOOR) imageType = 'packagecard_icon_floor';
                else if(event.type === RoomWidgetUpdatePresentDataEvent.CONTENTS_LANDSCAPE) imageType = 'packagecard_icon_landscape';
                else if(event.type === RoomWidgetUpdatePresentDataEvent.CONTENTS_WALLPAPER) imageType = 'packagecard_icon_wallpaper';

                setImageUrl(getGiftImageUrl(imageType));
                return;
            }
            case RoomWidgetUpdatePresentDataEvent.CONTENTS_CLUB: {
                setObjectId(event.objectId);
                setClassId(event.classId);
                setItemType(event.itemType);
                setText(event.giftMessage);
                setIsOwnerOfFurniture(event.isController);
                setImageUrl(getGiftImageUrl('packagecard_icon_hc'));
                return;
            }
            case RoomWidgetUpdatePresentDataEvent.CONTENTS: {
                if(!openRequested) return;

                setObjectId(event.objectId);
                setClassId(event.classId);
                setItemType(event.itemType);
                setText(event.giftMessage);
                setIsOwnerOfFurniture(event.isController);
                setPlacedItemId(event.placedItemId);
                setPlacedItemType(event.placedItemType);
                setPlacedInRoom(event.placedInRoom);

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

    const onRoomWidgetRoomObjectUpdateEvent = useCallback((event: RoomWidgetRoomObjectUpdateEvent) =>
    {
        if(event.id === objectId) clearGift();

        if(event.id === placedItemId)
        {
            if(placedInRoom) setPlacedInRoom(false);
        }
    }, [ objectId, placedItemId, placedInRoom, clearGift ]);

    CreateEventDispatcherHook(RoomWidgetRoomObjectUpdateEvent.FURNI_REMOVED, eventDispatcher, onRoomWidgetRoomObjectUpdateEvent);

    const close = useCallback(() =>
    {
        setObjectId(-1);
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

        if(isSpaces)
            return 'widget.furni.present.spaces.message_opened';
        
        return 'widget.furni.present.message_opened';
    }, [ objectId, isSpaces ]);

    const handleAction = useCallback((action: string) =>
    {
        switch(action)
        {
            case 'give_gift':
                CreateLinkEvent('catalog/open');
                return;
            case 'open':
                setOpenRequested(true);
                widgetHandler.processWidgetMessage(new RoomWidgetPresentOpenMessage(RoomWidgetPresentOpenMessage.OPEN_PRESENT, objectId));
                return;
            case 'room':
                return;
            case 'inventory':
                return;
        }
    }, [ widgetHandler, objectId ]);

    if(objectId === -1) return null;

    return (
        <NitroCardView className="nitro-gift-opening" simple={ true }>
            <NitroCardHeaderView headerText={ LocalizeText(senderName ? 'widget.furni.present.window.title_from' : 'widget.furni.present.window.title', ['name'], [senderName]) } onCloseClick={ close } />
            <NitroCardContentView>
                { placedItemId === -1 && <>
                <NitroLayoutGiftCardView userName={ senderName } figure={ senderFigure } message={ text } />
                <div className="d-flex gap-2 mt-2">
                    { senderName && <button className="btn btn-primary w-100 text-nowrap" onClick={ () => handleAction('give_gift') }>{ LocalizeText('widget.furni.present.give_gift', ['name'], [senderName]) }</button> }
                    <button className="btn btn-success w-100 text-nowrap" onClick={ () => handleAction('open') }>{ LocalizeText('widget.furni.present.open_gift') }</button>
                </div>
                </> }
                { placedItemId !== -1 && <>
                    <div className="d-flex gap-2 align-items-center">
                        <div>
                            <img src={ imageUrl } alt="" />
                        </div>
                        <div className="bg-muted rounded p-2 text-center text-black">
                            { LocalizeText(productName, ['product'], [text]) }
                        </div>
                    </div>
                    <div className="d-flex gap-2 mt-3">
                        <button className="btn btn-primary w-100 text-nowrap" onClick={ () => handleAction('inventory') }>{ LocalizeText('widget.furni.present.put_in_inventory') }</button>
                        <button className="btn btn-success w-100 text-nowrap" onClick={ () => handleAction('room') }>{ LocalizeText(placedItemType === FLOOR ? 'widget.furni.present.keep_in_room' : 'widget.furni.present.place_in_room') }</button>
                    </div>
                    { senderName &&  <>
                        <button className="btn btn-primary w-100 text-nowrap mt-2" onClick={ () => handleAction('give_gift') }>{ LocalizeText('widget.furni.present.give_gift', ['name'], [senderName]) }</button>
                    </> }
                </> }
            </NitroCardContentView>
        </NitroCardView>
    );
}
