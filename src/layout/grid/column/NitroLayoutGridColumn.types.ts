import { NitroLayoutColumns, NitroLayoutSpacing } from '../../common';
import { NitroLayoutFlexColumnProps } from '../../flex-column/NitroLayoutFlexColumn.types';

export interface NitroLayoutGridColumnProps extends NitroLayoutFlexColumnProps
{
    size?: NitroLayoutColumns;
    gap?: NitroLayoutSpacing;
}
