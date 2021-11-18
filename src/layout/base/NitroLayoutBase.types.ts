import { DetailedHTMLProps, HTMLAttributes, LegacyRef } from 'react';
import { NitroLayoutOverflow, NitroLayoutPosition, NitroLayoutSpacing } from '../common';

export interface NitroLayoutBaseProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
{
    innerRef?: LegacyRef<HTMLDivElement>;
    overflow?: NitroLayoutOverflow;
    position?: NitroLayoutPosition;
    gap?: NitroLayoutSpacing;
}
