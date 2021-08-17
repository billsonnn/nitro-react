import { RoomWidgetUpdateInfostandUserEvent } from '../../../../../../api';

export interface InfoStandWidgetBotViewProps
{
    botData: RoomWidgetUpdateInfostandUserEvent;
    close: () => void;
}
