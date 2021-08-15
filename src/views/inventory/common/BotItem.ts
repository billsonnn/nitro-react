import { BotData } from '@nitrots/nitro-renderer';

export class BotItem
{
    private _botData: BotData;
    private _selected: boolean;
    private _isUnseen: boolean;

    constructor(botData: BotData)
    {
        this._botData   = botData;
        this._selected  = false;
        this._isUnseen  = false;
    }

    public get id(): number
    {
        return this._botData.id;
    }

    public get botData(): BotData
    {
        return this._botData;
    }

    public get selected(): boolean
    {
        return this._selected;
    }

    public set selected(flag: boolean)
    {
        this._selected = flag;
    }

    public get isUnseen(): boolean
    {
        return this._isUnseen;
    }

    public set isUnseen(flag: boolean)
    {
        this._isUnseen = flag;
    }
}
