import { CatalogPageMessageOfferData, IObjectData, NitroEvent } from '@nitrots/nitro-renderer';

export class SetRoomPreviewerStuffDataEvent extends NitroEvent
{
    public static UPDATE_STUFF_DATA: string = 'SRPSA_UPDATE_STUFF_DATA';

    private _offer: CatalogPageMessageOfferData;
    private _stuffData: IObjectData;

    constructor(offer: CatalogPageMessageOfferData, stuffData: IObjectData)
    {
        super(SetRoomPreviewerStuffDataEvent.UPDATE_STUFF_DATA);

        this._offer = offer;
        this._stuffData = stuffData;
    }

    public get offer(): CatalogPageMessageOfferData
    {
        return this._offer;
    }

    public get stuffData(): IObjectData
    {
        return this._stuffData;
    }
}
