import { DetailsHTMLAttributes } from 'react';

export interface WidgetSlotViewProps extends DetailsHTMLAttributes<HTMLDivElement>
{
    widgetType: string;
    widgetSlot: number;
    widgetConf: string;
}
