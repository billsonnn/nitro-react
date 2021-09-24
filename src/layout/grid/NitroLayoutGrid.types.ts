import { DetailsHTMLAttributes } from 'react';
import { NitroLayoutSpacing } from '../common';

export interface NitroLayoutGridProps extends DetailsHTMLAttributes<HTMLDivElement>
{
    gap?: NitroLayoutSpacing;
}
