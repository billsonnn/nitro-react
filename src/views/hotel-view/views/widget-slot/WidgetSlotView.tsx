import { FC } from 'react';
import { GetWidgetLayout } from '../widgets/GetWidgetLayout';
import { WidgetSlotViewProps } from './WidgetSlotView.types';

export const WidgetSlotView: FC<WidgetSlotViewProps> = props =>
{
    const { widgetType = null, widgetSlot = 0, widgetConf = null, className= '', ...rest } = props;
    
    return (
        <div className={`widget-slot slot-${widgetSlot} ${(className || '')}`}  { ...rest }>
            <GetWidgetLayout widgetType={widgetType} slot={widgetSlot} widgetConf={widgetConf} />
        </div>
    );
}
