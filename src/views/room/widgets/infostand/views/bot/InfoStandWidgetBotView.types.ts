import { RoomWidgetUpdateInfostandUserEvent } from '../../../../events';

export interface InfoStandWidgetBotViewProps
{
    botData: RoomWidgetUpdateInfostandUserEvent;
    close: () => void;
}
