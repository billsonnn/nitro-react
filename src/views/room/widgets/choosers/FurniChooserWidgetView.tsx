import { FC, useCallback, useState } from 'react';
import { LocalizeText, RoomObjectItem, RoomWidgetChooserContentEvent, RoomWidgetRequestWidgetMessage, RoomWidgetUpdateRoomObjectEvent } from '../../../../api';
import { CreateEventDispatcherHook } from '../../../../hooks';
import { useRoomContext } from '../../context/RoomContext';
import { ChooserWidgetView } from './ChooserWidgetView';

export const FurniChooserWidgetView: FC<{}> = props =>
{
    const [ isVisible, setIsVisible ] = useState(false);
    const [ items, setItems ] = useState<RoomObjectItem[]>(null);
    const [ refreshTimeout, setRefreshTimeout ] = useState<ReturnType<typeof setTimeout>>(null);
    const { eventDispatcher = null, widgetHandler = null } = useRoomContext();

    const refreshChooser = useCallback(() =>
    {
        if(!isVisible) return;

        setRefreshTimeout(prevValue =>
            {
                if(prevValue) clearTimeout(prevValue);

                return setTimeout(() => widgetHandler.processWidgetMessage(new RoomWidgetRequestWidgetMessage(RoomWidgetRequestWidgetMessage.FURNI_CHOOSER)), 100);
            })
    }, [ isVisible, widgetHandler ]);

    const onRoomWidgetChooserContentEvent = useCallback((event: RoomWidgetChooserContentEvent) =>
    {
        setItems(event.items);
        setIsVisible(true);
    }, []);

    CreateEventDispatcherHook(RoomWidgetChooserContentEvent.FURNI_CHOOSER_CONTENT, eventDispatcher, onRoomWidgetChooserContentEvent);

    const onRoomWidgetRoomObjectUpdateEvent = useCallback((event: RoomWidgetUpdateRoomObjectEvent) =>
    {
        if(!isVisible) return;

        switch(event.type)
        {
            case RoomWidgetUpdateRoomObjectEvent.FURNI_ADDED:
            case RoomWidgetUpdateRoomObjectEvent.FURNI_REMOVED:
                refreshChooser();
                return;
        }
    }, [ isVisible, refreshChooser ]);

    CreateEventDispatcherHook(RoomWidgetUpdateRoomObjectEvent.FURNI_ADDED, eventDispatcher, onRoomWidgetRoomObjectUpdateEvent);
    CreateEventDispatcherHook(RoomWidgetUpdateRoomObjectEvent.FURNI_REMOVED, eventDispatcher, onRoomWidgetRoomObjectUpdateEvent);

    const close = useCallback(() =>
    {
        setIsVisible(false);
        setItems(null);
    }, []);

    if(!isVisible) return null;

    return <ChooserWidgetView title={ LocalizeText('widget.chooser.furni.title') } displayItemId={ true } items={ items } onCloseClick={ close } />;
}
