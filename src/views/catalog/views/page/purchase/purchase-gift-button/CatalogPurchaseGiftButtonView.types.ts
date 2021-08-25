import { CatalogPageMessageOfferData } from '@nitrots/nitro-renderer';

export interface CatalogPurchaseGiftButtonViewProps
{
    className?: string;
    offer: CatalogPageMessageOfferData;
    pageId: number;
    extra?: string;
    quantity?: number;
    isPurchaseAllowed?: boolean;
    beforePurchase?: () => void;
}
