import { NitroEvent } from '@nitrots/nitro-renderer';
import { CatalogWidgetEvent } from './CatalogWidgetEvent';

export class CatalogInitPurchaseEvent extends NitroEvent
{
    private _enableBuyAsGift: boolean = true;
    private _userName: string;

    constructor(enableBuyAsGift: boolean = true, userName: string = null)
    {
        super(CatalogWidgetEvent.INIT_PURCHASE);

        this._enableBuyAsGift = enableBuyAsGift;
        this._userName = userName;
    }

    public get enableBuyAsGift(): boolean
    {
        return this._enableBuyAsGift;
    }

    public get userName(): string
    {
        return this._userName;
    }
}
