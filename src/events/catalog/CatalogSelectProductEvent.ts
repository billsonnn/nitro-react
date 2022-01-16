import { NitroEvent } from '@nitrots/nitro-renderer';
import { IPurchasableOffer } from '../../components/catalog/common/IPurchasableOffer';

export class CatalogSelectProductEvent extends NitroEvent
{
    public static SELECT_PRODUCT: string = 'CSPE_SELECT_PRODUCT';

    private _offer: IPurchasableOffer;

    constructor(offer: IPurchasableOffer)
    {
        super(CatalogSelectProductEvent.SELECT_PRODUCT);

        this._offer = offer;
    }

    public get offer(): IPurchasableOffer
    {
        return this._offer;
    }
}
