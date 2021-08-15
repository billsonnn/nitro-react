import { CatalogPurchaseData } from '@nitrots/nitro-renderer';
import { CatalogEvent } from './CatalogEvent';

export class CatalogPurchasedEvent extends CatalogEvent
{
    private _purchase: CatalogPurchaseData;

    constructor(purchase: CatalogPurchaseData)
    {
        super(CatalogEvent.PURCHASE_SUCCESS);

        this._purchase = purchase;
    }

    public get purchase(): CatalogPurchaseData
    {
        return this._purchase;
    }
}
