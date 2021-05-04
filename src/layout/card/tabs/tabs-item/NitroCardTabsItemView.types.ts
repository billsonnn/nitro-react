import { MouseEventHandler } from 'react';

export interface NitroCardTabsItemViewProps
{
    tabText?: string;
    isActive?: boolean;
    onClick?: MouseEventHandler<HTMLLIElement>;
}
