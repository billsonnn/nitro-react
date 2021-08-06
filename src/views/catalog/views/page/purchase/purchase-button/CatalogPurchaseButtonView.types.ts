import { CatalogPageOfferData } from '@nitrots/nitro-renderer';

export interface CatalogPurchaseButtonViewProps
{
    className?: string;
    offer: CatalogPageOfferData;
    pageId: number;
    extra?: string;
    quantity?: number;
    isPurchaseAllowed?: boolean;
    disabled?: boolean;
    beforePurchase?: () => void;
}

export class CatalogPurchaseState
{
    public static NONE = 0;
    public static CONFIRM = 1;
    public static PURCHASE = 2;
    public static NO_CREDITS = 3;
    public static NO_POINTS = 4;
    public static SOLD_OUT = 5;
}
