import { FrontPageItem } from '@nitrots/nitro-renderer';
import { DetailedHTMLProps, HTMLAttributes } from 'react';

export interface CatalogLayoutFrontPageItemViewProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
{
    item: FrontPageItem;
}
