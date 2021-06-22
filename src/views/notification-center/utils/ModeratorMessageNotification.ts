import { NitroNotification } from './Notification';

export class ModeratorMessageNotification extends NitroNotification
{
    private _link: string;

    constructor(message: string, link: string)
    {
        super(message);
        this._link = link;
    }

    public get link(): string
    {
        return this._link;
    }
}
