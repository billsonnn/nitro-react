import { DetailsHTMLAttributes } from 'react';

export interface NitroCardGridItemViewProps extends DetailsHTMLAttributes<HTMLDivElement>
{
    itemImage?: string;
    itemColor?: string;
    itemActive?: boolean;
    itemCount?: number;
    itemCountMinimum?: number;
    itemUniqueNumber?: number;
    itemUnseen?: boolean;
}
