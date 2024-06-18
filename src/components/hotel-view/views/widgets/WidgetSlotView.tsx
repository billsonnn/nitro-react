import { DetailsHTMLAttributes, FC } from 'react';
import { GetWidgetLayout } from './GetWidgetLayout';

export interface WidgetSlotViewProps extends DetailsHTMLAttributes<HTMLDivElement>
{
    widgetType: string;
    widgetSlot: number;
    widgetConf: any;
}

export const WidgetSlotView: FC<WidgetSlotViewProps> = props =>
{
    const { widgetType = null, widgetSlot = 0, widgetConf = null, className= '', ...rest } = props;

    return (
        <div className={ `widget-slot slot-${ widgetSlot } ${ (className || '') }` } { ...rest }>
            <GetWidgetLayout slot={ widgetSlot } widgetConf={ widgetConf } widgetType={ widgetType } />
        </div>
    );
};
