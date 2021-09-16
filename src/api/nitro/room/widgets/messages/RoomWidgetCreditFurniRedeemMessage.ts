import { RoomWidgetMessage } from './RoomWidgetMessage';

export class RoomWidgetCreditFurniRedeemMessage extends RoomWidgetMessage
{
    public static REDEEM: string = 'RWCFRM_REDEEM';

    private _objectId: number;

    constructor(type: string, objectId: number)
    {
        super(type);
        
        this._objectId = objectId;
    }

    public get objectId(): number
    {
        return this._objectId;
    }
}
