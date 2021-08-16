import { FC, useCallback, useState } from 'react';
import { CreateEventDispatcherHook } from '../../../../hooks';
import { LocalizeText } from '../../../../utils';
import { useRoomContext } from '../../context/RoomContext';
import { RoomObjectItem, RoomWidgetChooserContentEvent, RoomWidgetRoomObjectUpdateEvent } from '../../events';
import { RoomWidgetRequestWidgetMessage } from '../../messages';
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
        setItems(event.items);
        setIsVisible(true);
    }, []);

    CreateEventDispatcherHook(RoomWidgetChooserContentEvent.USER_CHOOSER_CONTENT, eventDispatcher, onRoomWidgetChooserContentEvent);

    const onRoomWidgetRoomObjectUpdateEvent = useCallback((event: RoomWidgetRoomObjectUpdateEvent) =>
    {
        if(!isVisible) return;

        switch(event.type)
        {
            case RoomWidgetRoomObjectUpdateEvent.USER_ADDED:
            case RoomWidgetRoomObjectUpdateEvent.USER_REMOVED:
                refreshChooser();
                return;
        }
    }, [ isVisible, refreshChooser ]);

    CreateEventDispatcherHook(RoomWidgetRoomObjectUpdateEvent.USER_ADDED, eventDispatcher, onRoomWidgetRoomObjectUpdateEvent);
    CreateEventDispatcherHook(RoomWidgetRoomObjectUpdateEvent.USER_REMOVED, eventDispatcher, onRoomWidgetRoomObjectUpdateEvent);

    const close = useCallback(() =>
    {
        setIsVisible(false);
        setItems(null);
    }, []);
    
    if(!isVisible) return null;

    return <ChooserWidgetView title={ LocalizeText('widget.chooser.user.title') } displayItemId={ false } items={ items } onCloseClick={ close } />;
}
