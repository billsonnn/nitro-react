import { FC, useCallback, useState } from 'react';
import { RoomObjectItem } from '../../../../events/room-widgets/choosers/RoomObjectItem';
import { RoomWidgetChooserContentEvent } from '../../../../events/room-widgets/choosers/RoomWidgetChooserContentEvent';
import { useUiEvent } from '../../../../hooks';
import { LocalizeText } from '../../../../utils';
import { RoomWidgetRoomObjectUpdateEvent } from '../../events';
import { RoomWidgetRequestWidgetMessage } from '../../messages';
import { ChooserWidgetView } from './ChooserWidgetView';

export const FurniChooserWidgetView: FC = props =>
{
    const [isVisible, setIsVisible] = useState(false);
    const [items, setItems] = useState<RoomObjectItem[]>(null);

    const onFurniChooserContent = useCallback((event: RoomWidgetChooserContentEvent) =>
    {
        setItems(event.items);
        setIsVisible(true);
    }, []);

    useUiEvent(RoomWidgetChooserContentEvent.FURNI_CHOOSER_CONTENT, onFurniChooserContent);


    const onClose = useCallback(() =>
    {
        setIsVisible(false);
        setItems(null);
    }, []);

    if (!isVisible) return null;

    return (
        <div className="chooser-widget">
            <ChooserWidgetView title={LocalizeText('widget.chooser.furni.title')} displayItemId={true} onCloseClick={onClose} items={items} messageType={RoomWidgetRequestWidgetMessage.FURNI_CHOOSER} roomWidgetRoomObjectUpdateEvents={[RoomWidgetRoomObjectUpdateEvent.FURNI_REMOVED, RoomWidgetRoomObjectUpdateEvent.FURNI_ADDED]}></ChooserWidgetView>
        </div>
    )
}
