import { IObjectData, NitroEvent } from '@nitrots/nitro-renderer';
import { IPurchasableOffer } from '../../components/catalog/common/IPurchasableOffer';

export class SetRoomPreviewerStuffDataEvent extends NitroEvent
{
    public static UPDATE_STUFF_DATA: string = 'SRPSA_UPDATE_STUFF_DATA';

    private _offer: IPurchasableOffer;
    private _stuffData: IObjectData;

    constructor(offer: IPurchasableOffer, stuffData: IObjectData)
    {
        super(SetRoomPreviewerStuffDataEvent.UPDATE_STUFF_DATA);

        this._offer = offer;
        this._stuffData = stuffData;
    }

    public get offer(): IPurchasableOffer
    {
        return this._offer;
    }

    public get stuffData(): IObjectData
    {
        return this._stuffData;
    }
}
