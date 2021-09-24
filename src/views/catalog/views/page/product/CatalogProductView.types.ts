import { CatalogPageMessageProductData } from '@nitrots/nitro-renderer';
import { DetailsHTMLAttributes } from 'react';

export interface CatalogProductViewProps extends DetailsHTMLAttributes<HTMLDivElement>
{
    isActive: boolean;
    product: CatalogPageMessageProductData;
}
