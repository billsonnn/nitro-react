import { DetailedHTMLProps, HTMLAttributes } from 'react';
import { NitroLayoutOverflow, NitroLayoutPosition, NitroLayoutSpacing } from '../common';

export interface NitroLayoutBaseProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
{
    overflow?: NitroLayoutOverflow;
    position?: NitroLayoutPosition;
    gap?: NitroLayoutSpacing;
}
