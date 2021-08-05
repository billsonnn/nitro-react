import { NitroNotification } from './Notification';

export class HotelWillShutdownNotification extends NitroNotification
{
    private _minutes: number;

    constructor(minutes: number)
    {
        super();
        this._minutes = minutes;
    }

    public get minutes(): number
    {
        return this._minutes;
    }
}
