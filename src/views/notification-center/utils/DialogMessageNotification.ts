import { NitroNotification } from './Notification';

export class DialogMessageNotification extends NitroNotification
{
    private _type: string;
    private _parameters: Map<string, string>;

    constructor(type: string, parameters: Map<string, string>)
    {
        super();
        this._type = type;
        this._parameters = parameters;
    }

    public get type(): string
    {
        return this._type;
    }

    public get parameters(): Map<string, string>
    {
        return this._parameters;
    }
}
