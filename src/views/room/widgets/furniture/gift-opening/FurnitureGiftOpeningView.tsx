import { FC, useCallback, useState } from 'react';
import { LocalizeText, RoomWidgetRoomObjectUpdateEvent, RoomWidgetUpdatePresentDataEvent } from '../../../../../api';
import { CreateEventDispatcherHook } from '../../../../../hooks/events/event-dispatcher.base';
import { NitroCardContentView, NitroCardHeaderView, NitroCardView } from '../../../../../layout';
import { useRoomContext } from '../../../context/RoomContext';

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

    if(objectId === -1) return null;

    return (
        <NitroCardView className="nitro-exchange-credit" simple={ true }>
            <NitroCardHeaderView headerText={ LocalizeText('catalog.redeem.dialog.title') } onCloseClick={ close } />
            <NitroCardContentView>
                plz
            </NitroCardContentView>
        </NitroCardView>
    );
}
