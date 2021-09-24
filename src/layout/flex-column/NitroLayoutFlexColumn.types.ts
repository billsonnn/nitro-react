import { DetailsHTMLAttributes } from 'react';
import { NitroLayoutOverflow, NitroLayoutPosition, NitroLayoutSpacing } from '../common';

export interface NitroLayoutFlexColumnProps extends DetailsHTMLAttributes<HTMLDivElement>
{
    overflow?: NitroLayoutOverflow;
    position?: NitroLayoutPosition;
    gap?: NitroLayoutSpacing;
}
