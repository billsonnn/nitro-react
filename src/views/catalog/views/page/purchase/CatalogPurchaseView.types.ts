import { CatalogPageOfferData } from '@nitrots/nitro-renderer';

export interface CatalogPurchaseViewProps
{
    offer: CatalogPageOfferData;
    pageId: number;
    extra?: string;
    disabled?: boolean;
}
