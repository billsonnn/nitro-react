import { CatalogProductOfferData } from 'nitro-renderer';
import { MouseEventHandler } from 'react';

export interface CatalogProductViewProps
{
    isActive: boolean;
    product: CatalogProductOfferData;
    onMouseEvent?: MouseEventHandler<Element>;
}
