import { TradeUserData } from '../../components/inventory/common/TradeUserData';
import { InventoryEvent } from './InventoryEvent';

export class InventoryTradeStartEvent extends InventoryEvent
{
    public static START_TRADE: string = 'ITSE_START_TRADE';

    private _ownUserTradeData: TradeUserData;
    private _otherUserTradeData: TradeUserData;

    constructor(ownUserTradeData: TradeUserData, otherUserTradeData: TradeUserData)
    {
        super(InventoryTradeStartEvent.START_TRADE);

        this._ownUserTradeData = ownUserTradeData;
        this._otherUserTradeData = otherUserTradeData;
    }

    public get ownUserTradeData(): TradeUserData
    {
        return this._ownUserTradeData;
    }

    public get otherUserTradeData(): TradeUserData
    {
        return this._otherUserTradeData;
    }
}
