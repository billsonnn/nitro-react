import { RoomWidgetMessage } from './RoomWidgetMessage';

export class RoomWidgetChangeMottoMessage extends RoomWidgetMessage
{
    public static CHANGE_MOTTO: string = 'RWCMM_CHANGE_MOTTO';

    private _motto: string;

    constructor(type: string, motto: string)
    {
        super(type);

        this._motto = motto;
    }

    public get motto(): string
    {
        return this._motto;
    }
}
