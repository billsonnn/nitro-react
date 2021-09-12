import { CatalogEvent } from './CatalogEvent';

export class CatalogInitGiftEvent extends CatalogEvent
{
    private _pageId: number;
    private _offerId: number;
    private _extraData: string;

    constructor(pageId: number, offerId: number, extraData: string)
    {
        super(CatalogEvent.INIT_GIFT);

        this._pageId = pageId;
        this._offerId = offerId;
        this._extraData = extraData;
    }

    public get pageId(): number
    {
        return this._pageId;
    }

    public get offerId(): number
    {
        return this._offerId;
    }

    public get extraData(): string
    {
        return this._extraData;
    }
}
