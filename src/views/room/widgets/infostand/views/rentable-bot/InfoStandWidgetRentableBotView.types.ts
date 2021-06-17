import { RoomWidgetUpdateInfostandRentableBotEvent } from '../../../../events';

export interface InfoStandWidgetRentableBotViewProps
{
    rentableBotData: RoomWidgetUpdateInfostandRentableBotEvent;
    close: () => void;
}
