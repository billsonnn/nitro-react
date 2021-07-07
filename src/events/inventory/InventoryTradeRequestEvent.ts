import { InventoryEvent } from './InventoryEvent';

export class InventoryTradeRequestEvent extends InventoryEvent
{
    public static REQUEST_TRADE: string = 'ITSE_REQUEST_TRADE';

    private _objectId: number;
    private _username: string;

    constructor(objectId: number, username: string)
    {
        super(InventoryTradeRequestEvent.REQUEST_TRADE);

        this._objectId = objectId;
        this._username = username;
    }

    public get objectId(): number
    {
        return this._objectId;
    }

    public get username(): string
    {
        return this._username;
    }
}
