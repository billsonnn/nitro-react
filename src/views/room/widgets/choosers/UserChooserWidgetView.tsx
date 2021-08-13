import { FC, useCallback, useState } from 'react';
import { RoomObjectItem } from '../../../../events/room-widgets/choosers/RoomObjectItem';
import { RoomWidgetChooserContentEvent } from '../../../../events/room-widgets/choosers/RoomWidgetChooserContentEvent';
import { useUiEvent } from '../../../../hooks';
import { LocalizeText } from '../../../../utils';
import { RoomWidgetRoomObjectUpdateEvent } from '../../events';
import { RoomWidgetRequestWidgetMessage } from '../../messages';
import { ChooserWidgetView } from './ChooserWidgetView';

export const UserChooserWidgetView : FC = props =>
{
    const [isVisible, setIsVisible] = useState(false);
    const [items, setItems] = useState<RoomObjectItem[]>(null);

    const onUserChooserContent = useCallback((event: RoomWidgetChooserContentEvent) =>
    {
        setItems(event.items);
        setIsVisible(true);
    }, []);

    useUiEvent(RoomWidgetChooserContentEvent.USER_CHOOSER_CONTENT, onUserChooserContent);

    const onClose = useCallback(() =>
    {
        setIsVisible(false);
        setItems(null);
    }, []);
    
    if(!isVisible) return null;

    return (
        <div className="chooser-widget">
            <ChooserWidgetView title={LocalizeText('widget.chooser.user.title')} displayItemId={false} onCloseClick={onClose} items={items} messageType={RoomWidgetRequestWidgetMessage.USER_CHOOSER} roomWidgetRoomObjectUpdateEvents={[RoomWidgetRoomObjectUpdateEvent.USER_REMOVED, RoomWidgetRoomObjectUpdateEvent.USER_ADDED]}></ChooserWidgetView>
        </div>
    );
}
