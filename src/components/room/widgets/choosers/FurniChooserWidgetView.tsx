import { SecurityLevel } from '@nitrots/nitro-renderer';
import { FC, useCallback, useState } from 'react';
import { GetSessionDataManager, LocalizeText, RoomObjectItem, RoomWidgetChooserContentEvent, RoomWidgetRequestWidgetMessage, RoomWidgetUpdateRoomObjectEvent } from '../../../../api';
import { UseEventDispatcherHook } from '../../../../hooks';
import { useRoomContext } from '../../RoomContext';
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
        });
    }, [ isVisible, widgetHandler ]);

    const onRoomWidgetChooserContentEvent = useCallback((event: RoomWidgetChooserContentEvent) =>
    {
        setItems(event.items);
        setIsVisible(true);
    }, []);

    UseEventDispatcherHook(RoomWidgetChooserContentEvent.FURNI_CHOOSER_CONTENT, eventDispatcher, onRoomWidgetChooserContentEvent);

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

    UseEventDispatcherHook(RoomWidgetUpdateRoomObjectEvent.FURNI_ADDED, eventDispatcher, onRoomWidgetRoomObjectUpdateEvent);
    UseEventDispatcherHook(RoomWidgetUpdateRoomObjectEvent.FURNI_REMOVED, eventDispatcher, onRoomWidgetRoomObjectUpdateEvent);

    const close = useCallback(() =>
    {
        setIsVisible(false);
        setItems(null);
    }, []);

    if(!items) return null;

    return <ChooserWidgetView title={ LocalizeText('widget.chooser.furni.title') } displayItemId={ GetSessionDataManager().hasSecurity(SecurityLevel.MODERATOR) } items={ items } onCloseClick={ close } />;
}
