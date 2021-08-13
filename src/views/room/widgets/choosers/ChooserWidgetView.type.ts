import { MouseEvent } from 'react';
import { RoomObjectItem } from '../../../../events/room-widgets/choosers/RoomObjectItem';

export interface ChooserWidgetViewProps
{
    title: string;
    onCloseClick: (event: MouseEvent) => void;
    displayItemId: boolean;
    items: RoomObjectItem[];
    messageType: string;
    roomWidgetRoomObjectUpdateEvents: string[];
}
