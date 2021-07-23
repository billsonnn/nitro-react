import { MouseEventHandler } from 'react';

export interface NitroCardTabsItemViewProps
{
    isActive?: boolean;
    count?: number;
    onClick?: MouseEventHandler<HTMLLIElement>;
}
