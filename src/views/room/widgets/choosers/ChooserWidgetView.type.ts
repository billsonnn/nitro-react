import { RoomObjectItem } from '../../events';

export interface ChooserWidgetViewProps
{
    title: string;
    items: RoomObjectItem[];
    displayItemId: boolean;
    onCloseClick: () => void;
}
