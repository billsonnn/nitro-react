import { CatalogEvent } from './CatalogEvent';

export class CatalogNameResultEvent extends CatalogEvent
{
    private _result: number;
    private _validationInfo: string;

    constructor(result: number, validationInfo: string)
    {
        super(CatalogEvent.APPROVE_NAME_RESULT);

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
