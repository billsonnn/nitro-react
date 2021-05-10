import { CatalogEvent } from './CatalogEvent';

export class CatalogPurchaseFailureEvent extends CatalogEvent
{
    private _code: number;

    constructor(code: number)
    {
        super(CatalogEvent.PURCHASE_FAILED);

        this._code = code;
    }

    public get code(): number
    {
        return this._code;
    }
}
