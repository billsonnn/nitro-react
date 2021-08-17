import { RoomWidgetUpdateInfostandUserEvent } from '../../../../../../api';

export interface InfoStandWidgetUserViewProps
{
    userData: RoomWidgetUpdateInfostandUserEvent;
    close: () => void;
}
