import { DetailsHTMLAttributes } from 'react';

export interface NitroCardGridItemViewProps extends DetailsHTMLAttributes<HTMLDivElement>
{
    itemImage?: string;
    itemActive?: boolean;
    itemCount?: number;
    itemUnique?: boolean;
    itemUniqueNumber?: number;
    itemUnseen?: boolean;
}
