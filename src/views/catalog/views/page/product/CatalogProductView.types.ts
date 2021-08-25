import { CatalogPageMessageProductData } from '@nitrots/nitro-renderer';
import { MouseEventHandler } from 'react';

export interface CatalogProductViewProps
{
    isActive: boolean;
    product: CatalogPageMessageProductData;
    onMouseEvent?: MouseEventHandler<Element>;
}
