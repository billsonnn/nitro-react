import { NitroEvent } from '@nitrots/nitro-renderer';

export class CatalogPageOpenedEvent extends NitroEvent
{
    public static CATALOG_PAGE_OPENED: string = 'CPOE_CATALOG_PAGE_OPENED';

    private _pageId: number;
    private _localization: string;

    constructor(pageId: number, localization: string)
    {
        super(CatalogPageOpenedEvent.CATALOG_PAGE_OPENED);

        this._pageId = pageId;
        this._localization = localization;
    }

    public get pageId(): number
    {
        return this._pageId;
    }

    public get localization(): string
    {
        return this._localization;
    }
}
