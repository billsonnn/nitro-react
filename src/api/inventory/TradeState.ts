export class TradeState
{
    public static TRADING_STATE_READY: number = 0;
    public static TRADING_STATE_RUNNING: number = 1;
    public static TRADING_STATE_COUNTDOWN: number = 2;
    public static TRADING_STATE_CONFIRMING: number = 3;
    public static TRADING_STATE_CONFIRMED: number = 4;
    public static TRADING_STATE_COMPLETED: number = 5;
    public static TRADING_STATE_CANCELLED: number = 6;
}
