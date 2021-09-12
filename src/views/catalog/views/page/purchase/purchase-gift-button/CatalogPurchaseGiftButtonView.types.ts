import { CatalogPageMessageOfferData } from '@nitrots/nitro-renderer';

export interface CatalogPurchaseGiftButtonViewProps
{
    className?: string;
    offer: CatalogPageMessageOfferData;
    pageId: number;
    extra?: string;
    disabled?: boolean;
}
