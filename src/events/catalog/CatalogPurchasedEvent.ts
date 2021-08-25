import { PurchaseOKMessageOfferData } from '@nitrots/nitro-renderer';
import { CatalogEvent } from './CatalogEvent';

export class CatalogPurchasedEvent extends CatalogEvent
{
    private _purchase: PurchaseOKMessageOfferData;

    constructor(purchase: PurchaseOKMessageOfferData)
    {
        super(CatalogEvent.PURCHASE_SUCCESS);

        this._purchase = purchase;
    }

    public get purchase(): PurchaseOKMessageOfferData
    {
        return this._purchase;
    }
}
