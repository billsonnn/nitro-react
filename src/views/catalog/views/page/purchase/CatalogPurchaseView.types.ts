import { CatalogPageMessageOfferData } from '@nitrots/nitro-renderer';

export interface CatalogPurchaseViewProps
{
    offer: CatalogPageMessageOfferData;
    pageId: number;
    extra?: string;
    disabled?: boolean;
}
