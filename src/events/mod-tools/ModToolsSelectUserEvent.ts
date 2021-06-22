import { ModToolsEvent } from './ModToolsEvent';

export class ModToolsSelectUserEvent extends ModToolsEvent
{
    private _webID: number;
    private _name: string;

    constructor(webID: number, name: string)
    {
        super(ModToolsEvent.SELECT_USER);

        this._webID = webID;
        this._name = name;
    }

    public get webID(): number
    {
        return this._webID;
    }

    public get name(): string
    {
        return this._name;
    }
}
