import { FC, useCallback, useState } from 'react';
import { LocalizeText, RoomObjectItem, RoomWidgetChooserContentEvent, RoomWidgetRequestWidgetMessage, RoomWidgetUpdateRoomObjectEvent } from '../../../../api';
import { BatchUpdates, CreateEventDispatcherHook } from '../../../../hooks';
import { useRoomContext } from '../../context/RoomContext';
import { ChooserWidgetView } from './ChooserWidgetView';

export const UserChooserWidgetView: FC<{}> = props =>
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
        BatchUpdates(() =>
        {
            setItems(event.items);
            setIsVisible(true);
        });
    }, []);

    CreateEventDispatcherHook(RoomWidgetChooserContentEvent.USER_CHOOSER_CONTENT, eventDispatcher, onRoomWidgetChooserContentEvent);

    const onRoomWidgetRoomObjectUpdateEvent = useCallback((event: RoomWidgetUpdateRoomObjectEvent) =>
    {
        if(!isVisible) return;

        switch(event.type)
        {
            case RoomWidgetUpdateRoomObjectEvent.USER_ADDED:
            case RoomWidgetUpdateRoomObjectEvent.USER_REMOVED:
                refreshChooser();
                return;
        }
    }, [ isVisible, refreshChooser ]);

    CreateEventDispatcherHook(RoomWidgetUpdateRoomObjectEvent.USER_ADDED, eventDispatcher, onRoomWidgetRoomObjectUpdateEvent);
    CreateEventDispatcherHook(RoomWidgetUpdateRoomObjectEvent.USER_REMOVED, eventDispatcher, onRoomWidgetRoomObjectUpdateEvent);

    const close = useCallback(() =>
    {
        BatchUpdates(() =>
        {
            setIsVisible(false);
            setItems(null);
        });
    }, []);
    
    if(!isVisible) return null;

    return <ChooserWidgetView title={ LocalizeText('widget.chooser.user.title') } displayItemId={ false } items={ items } onCloseClick={ close } />;
}
