import { RoomWidgetMessage } from './RoomWidgetMessage';

export class RoomWidgetChangeMottoMessage extends RoomWidgetMessage
{
    public static CHANGE_MOTTO: string = 'RWCMM_CHANGE_MOTTO';

    private _motto: string;

    constructor(motto: string)
    {
        super(RoomWidgetChangeMottoMessage.CHANGE_MOTTO);

        this._motto = motto;
    }

    public get motto(): string
    {
        return this._motto;
    }
}
