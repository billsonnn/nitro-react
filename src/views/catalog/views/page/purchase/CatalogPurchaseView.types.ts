import { CatalogPageOfferData } from 'nitro-renderer';

export interface CatalogPurchaseViewProps
{
    offer: CatalogPageOfferData;
    pageId: number;
    extra?: string;
    disabled?: boolean;
}
