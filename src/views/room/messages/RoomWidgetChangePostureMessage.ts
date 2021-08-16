import { RoomWidgetMessage } from './RoomWidgetMessage';

export class RoomWidgetChangePostureMessage extends RoomWidgetMessage
{
    public static CHANGE_POSTURE: string = 'RWCPM_MESSAGE_CHANGE_POSTURE';
    public static POSTURE_STAND: number = 0;
    public static POSTURE_SIT: number = 1;

    private _posture: number;

    constructor(posture: number)
    {
        super(RoomWidgetChangePostureMessage.CHANGE_POSTURE);

        this._posture = posture;
    }

    public get posture(): number
    {
        return this._posture;
    }
}
