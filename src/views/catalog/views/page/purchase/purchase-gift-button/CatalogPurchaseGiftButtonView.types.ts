import { CatalogPageOfferData } from 'nitro-renderer';

export interface CatalogPurchaseGiftButtonViewProps
{
    className?: string;
    offer: CatalogPageOfferData;
    pageId: number;
    extra?: string;
    quantity?: number;
    isPurchaseAllowed?: boolean;
    beforePurchase?: () => void;
}
