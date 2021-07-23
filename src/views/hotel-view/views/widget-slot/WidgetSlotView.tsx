import { FC } from 'react';
import { GetWidgetLayout } from '../widgets/GetWidgetLayout';
import { WidgetSlotViewProps } from './WidgetSlotView.types';

export const WidgetSlotView: FC<WidgetSlotViewProps> = props =>
{
  return (
    <div className={"widget-slot slot-" + props.slot}>
      <GetWidgetLayout widgetType={props.widgetType} slot={props.slot} widgetConf={props.widgetConf} />
    </div>
  );
}
