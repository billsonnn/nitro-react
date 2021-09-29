import { DetailsHTMLAttributes } from 'react';

export interface NitroCardGridViewProps extends DetailsHTMLAttributes<HTMLDivElement>
{
    columns?: number;
    gap?: number;
}
