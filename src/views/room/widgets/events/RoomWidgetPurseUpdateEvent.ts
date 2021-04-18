import { RoomWidgetUpdateEvent } from 'nitro-renderer';

export class RoomWidgetPurseUpdateEvent extends RoomWidgetUpdateEvent
{
    public static RWPUE_CREDIT_BALANCE: string = 'RWPUE_CREDIT_BALANCE';
    public static RWPUE_PIXEL_BALANCE: string = 'RWPUE_PIXEL_BALANCE';
    public static RWPUE_SHELL_BALANCE: string = 'RWPUE_SHELL_BALANCE';

    private _balance: number;

    constructor(k: string, _arg_2: number)
    {
        super(k);

        this._balance = _arg_2;
    }

    public get balance(): number
    {
        return this._balance;
    }
}
