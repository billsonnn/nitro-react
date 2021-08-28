import { DetailsHTMLAttributes } from 'react';

export interface NitroCardGridItemViewProps extends DetailsHTMLAttributes<HTMLDivElement>
{
    itemImage?: string;
    itemColor?: string;
    itemActive?: boolean;
    itemCount?: number;
    itemUnique?: boolean;
    itemUniqueNumber?: number;
    itemUnseen?: boolean;
    columns?: number;
    backgroundDisabled?: boolean;
}
