import { RoomWidgetUpdateInfostandRentableBotEvent } from '../../../../events';

export interface AvatarInfoWidgetRentableBotViewProps
{
    rentableBotData: RoomWidgetUpdateInfostandRentableBotEvent;
    close: () => void;
}
