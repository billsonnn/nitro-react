import { ModToolsEvent } from './ModToolsEvent';

export class ModToolsOpenUserInfoEvent extends ModToolsEvent
{
    private _userId: number;

    constructor(userId: number)
    {
        super(ModToolsEvent.OPEN_USER_INFO);

        this._userId = userId;
    }

    public get userId(): number
    {
        return this._userId;
    }
}
