import { NitroEvent } from '@nitrots/nitro-renderer';

export class CatalogSetExtraPurchaseParameterEvent extends NitroEvent
{
    public static SET_EXTRA_PARAM: string = 'CSEPPE_SET_EXTRA_PARAM';

    private _parameter: string;

    constructor(parameter: string)
    {
        super(CatalogSetExtraPurchaseParameterEvent.SET_EXTRA_PARAM);

        this._parameter = parameter;
    }

    public get parameter(): string
    {
        return this._parameter;
    }
}
