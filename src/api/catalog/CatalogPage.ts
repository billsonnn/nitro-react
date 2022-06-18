import { ICatalogPage } from './ICatalogPage';
import { IPageLocalization } from './IPageLocalization';
import { IPurchasableOffer } from './IPurchasableOffer';

export class CatalogPage implements ICatalogPage
{
    public static MODE_NORMAL: number = 0;

    private _pageId: number;
    private _layoutCode: string;
    private _localization: IPageLocalization;
    private _offers: IPurchasableOffer[];
    private _acceptSeasonCurrencyAsCredits: boolean;
    private _mode: number;

    constructor(pageId: number, layoutCode: string, localization: IPageLocalization, offers: IPurchasableOffer[], acceptSeasonCurrencyAsCredits: boolean, mode: number = -1)
    {
        this._pageId = pageId;
        this._layoutCode = layoutCode;
        this._localization = localization;
        this._offers = offers;
        this._acceptSeasonCurrencyAsCredits = acceptSeasonCurrencyAsCredits;

        for(const offer of offers) (offer.page = this);

        if(mode === -1) this._mode = CatalogPage.MODE_NORMAL;
        else this._mode = mode;
    }

    public get pageId(): number
    {
        return this._pageId;
    }

    public get layoutCode(): string
    {
        return this._layoutCode;
    }

    public get localization(): IPageLocalization
    {
        return this._localization;
    }

    public get offers(): IPurchasableOffer[]
    {
        return this._offers;
    }

    public get acceptSeasonCurrencyAsCredits(): boolean
    {
        return this._acceptSeasonCurrencyAsCredits;
    }

    public get mode(): number
    {
        return this._mode;
    }
}
