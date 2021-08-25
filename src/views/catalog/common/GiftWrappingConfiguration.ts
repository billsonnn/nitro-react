import { GiftWrappingConfigurationParser } from '@nitrots/nitro-renderer';

export class GiftWrappingConfiguration
{
    private _isEnabled: boolean = false;
    private _price: number = null;
    private _stuffTypes: number[] = null;
    private _boxTypes: number[] = null;
    private _ribbonTypes: number[] = null;
    private _defaultStuffTypes: number[] = null;

    constructor(parser: GiftWrappingConfigurationParser)
    {
        this._isEnabled = parser.isEnabled;
        this._price = parser.price;
        this._boxTypes = parser.boxTypes;
        this._ribbonTypes = parser.ribbonTypes;
        this._stuffTypes = parser.giftWrappers;
        this._defaultStuffTypes = parser.giftFurnis;
    }

    public get isEnabled(): boolean
    {
        return this._isEnabled;
    }

    public get price(): number
    {
        return this._price;
    }

    public get stuffTypes(): number[]
    {
        return this._stuffTypes;
    }

    public get boxTypes(): number[]
    {
        return this._boxTypes;
    }

    public get ribbonTypes(): number[]
    {
        return this._ribbonTypes;
    }

    public get defaultStuffTypes(): number[]
    {
        return this._defaultStuffTypes;
    }
}
