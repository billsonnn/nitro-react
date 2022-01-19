import { NitroEvent } from '@nitrots/nitro-renderer';
import { IPurchasableOffer } from '../../components/catalog/common/IPurchasableOffer';
import { CatalogWidgetEvent } from './CatalogWidgetEvent';

export class CatalogSelectProductEvent extends NitroEvent
{
    private _offer: IPurchasableOffer;

    constructor(offer: IPurchasableOffer)
    {
        super(CatalogWidgetEvent.SELECT_PRODUCT);

        this._offer = offer;
    }

    public get offer(): IPurchasableOffer
    {
        return this._offer;
    }
}
