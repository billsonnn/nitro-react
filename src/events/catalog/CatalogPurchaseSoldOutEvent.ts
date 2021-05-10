import { CatalogEvent } from './CatalogEvent';

export class CatalogPurchaseSoldOutEvent extends CatalogEvent
{
    constructor()
    {
        super(CatalogEvent.SOLD_OUT);
    }
}
