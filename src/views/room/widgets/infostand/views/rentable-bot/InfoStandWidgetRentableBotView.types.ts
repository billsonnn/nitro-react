import { RoomWidgetUpdateInfostandRentableBotEvent } from '../../../../../../api';

export interface InfoStandWidgetRentableBotViewProps
{
    rentableBotData: RoomWidgetUpdateInfostandRentableBotEvent;
    close: () => void;
}
