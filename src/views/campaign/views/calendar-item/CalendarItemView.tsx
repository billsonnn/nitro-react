import { FC } from 'react';
import { NitroLayoutFlexColumn } from '../../../../layout';
import { CalendarItemViewProps } from './CalendarItemView.types';

export const CalendarItemView: FC<CalendarItemViewProps> = props =>
{
    return (
        <NitroLayoutFlexColumn className="calendar-day h-100 w-100" />
    );
}
