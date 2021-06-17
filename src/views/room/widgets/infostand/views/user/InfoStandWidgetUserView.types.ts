import { RoomWidgetUpdateInfostandUserEvent } from '../../../../events';

export interface InfoStandWidgetUserViewProps
{
    userData: RoomWidgetUpdateInfostandUserEvent;
    close: () => void;
}
