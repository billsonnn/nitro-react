import { CatalogEvent } from '.';
import { FurnitureItem } from '../../views/inventory/common/FurnitureItem';

export class CatalogPostMarketplaceOfferEvent extends CatalogEvent
{
    public static readonly POST_MARKETPLACE = 'CE_POST_MARKETPLACE';
    
    private _item: FurnitureItem;

    constructor(item: FurnitureItem)
    {
        super(CatalogPostMarketplaceOfferEvent.POST_MARKETPLACE);
        this._item = item;
    }

    public get item(): FurnitureItem
    {
        return this._item;
    }
}
