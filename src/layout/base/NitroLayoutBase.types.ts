import { ButtonHTMLAttributes, DetailedHTMLProps } from 'react';
import { NitroLayoutOverflow, NitroLayoutPosition, NitroLayoutSpacing } from '../common';

export interface NitroLayoutBaseProps extends DetailedHTMLProps<ButtonHTMLAttributes<HTMLDivElement>, HTMLDivElement>
{
    overflow?: NitroLayoutOverflow;
    position?: NitroLayoutPosition;
    gap?: NitroLayoutSpacing;
}
