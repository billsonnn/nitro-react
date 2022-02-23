import { NitroEvent } from '@nitrots/nitro-renderer';
import { CatalogWidgetEvent } from './CatalogWidgetEvent';

export class CatalogSetExtraPurchaseParameterEvent extends NitroEvent
{
    private _parameter: string;

    constructor(parameter: string)
    {
        super(CatalogWidgetEvent.SET_EXTRA_PARM);

        this._parameter = parameter;
    }

    public get parameter(): string
    {
        return this._parameter;
    }
}
