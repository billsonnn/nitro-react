import { MouseEventHandler } from 'react';

export interface NitroCardTabsItemViewProps
{
    isActive?: boolean;
    onClick?: MouseEventHandler<HTMLLIElement>;
}
