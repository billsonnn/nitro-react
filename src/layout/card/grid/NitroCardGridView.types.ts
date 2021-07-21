import { DetailsHTMLAttributes } from 'react';

export interface NitroCardGridViewProps extends DetailsHTMLAttributes<HTMLDivElement>
{
    columns?: number;
    theme?: string;
}

export class NitroCardGridThemes
{
    public static THEME_DEFAULT: string = 'theme-default';
    public static THEME_SHADOWED: string = 'theme-shadowed';
}
