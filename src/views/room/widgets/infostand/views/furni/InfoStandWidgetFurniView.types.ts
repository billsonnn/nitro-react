import { RoomWidgetUpdateInfostandFurniEvent } from '../../../../events';

export interface InfoStandWidgetFurniViewProps
{
    furniData: RoomWidgetUpdateInfostandFurniEvent;
    close: () => void;
}
