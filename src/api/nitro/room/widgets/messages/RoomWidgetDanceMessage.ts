import { RoomWidgetMessage } from './RoomWidgetMessage';

export class RoomWidgetDanceMessage extends RoomWidgetMessage
{
    public static DANCE: string = 'RWDM_MESSAGE_DANCE';
    public static NORMAL_STYLE: number = 0;
    public static CLUB_STYLE: number[] = [2, 3, 4];

    private _style: number = 0;

    constructor(style: number)
    {
        super(RoomWidgetDanceMessage.DANCE);

        this._style = style;
    }

    public get style(): number
    {
        return this._style;
    }
}
