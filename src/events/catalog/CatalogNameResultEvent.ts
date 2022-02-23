import { NitroEvent } from '@nitrots/nitro-renderer';
import { CatalogWidgetEvent } from './CatalogWidgetEvent';

export class CatalogNameResultEvent extends NitroEvent
{
    private _result: number;
    private _validationInfo: string;

    constructor(result: number, validationInfo: string)
    {
        super(CatalogWidgetEvent.APPROVE_RESULT);

        this._result = result;
        this._validationInfo = validationInfo;
    }

    public get result(): number
    {
        return this._result;
    }

    public get validationInfo(): string
    {
        return this._validationInfo;
    }
}
