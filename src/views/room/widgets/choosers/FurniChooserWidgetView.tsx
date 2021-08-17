import { FC, useCallback, useState } from 'react';
import { LocalizeText, RoomObjectItem, RoomWidgetChooserContentEvent, RoomWidgetRequestWidgetMessage, RoomWidgetRoomObjectUpdateEvent } from '../../../../api';
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

    const onRoomWidgetRoomObjectUpdateEvent = useCallback((event: RoomWidgetRoomObjectUpdateEvent) =>
    {
        if(!isVisible) return;

        switch(event.type)
        {
            case RoomWidgetRoomObjectUpdateEvent.FURNI_ADDED:
            case RoomWidgetRoomObjectUpdateEvent.FURNI_REMOVED:
                refreshChooser();
                return;
        }
    }, [ isVisible, refreshChooser ]);

    CreateEventDispatcherHook(RoomWidgetRoomObjectUpdateEvent.FURNI_ADDED, eventDispatcher, onRoomWidgetRoomObjectUpdateEvent);
    CreateEventDispatcherHook(RoomWidgetRoomObjectUpdateEvent.FURNI_REMOVED, eventDispatcher, onRoomWidgetRoomObjectUpdateEvent);

    const close = useCallback(() =>
    {
        setIsVisible(false);
        setItems(null);
    }, []);

    if(!isVisible) return null;

    return <ChooserWidgetView title={ LocalizeText('widget.chooser.furni.title') } displayItemId={ true } items={ items } onCloseClick={ close } />;
}
