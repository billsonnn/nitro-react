import { RoomObjectItem } from '../../../../api';

export interface ChooserWidgetViewProps
{
    title: string;
    items: RoomObjectItem[];
    displayItemId: boolean;
    onCloseClick: () => void;
}
