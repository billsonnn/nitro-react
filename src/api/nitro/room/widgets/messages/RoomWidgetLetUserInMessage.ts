import { RoomWidgetMessage } from './RoomWidgetMessage';

export class RoomWidgetLetUserInMessage extends RoomWidgetMessage
{
    public static LET_USER_IN: string = 'RWLUIM_LET_USER_IN';

    private _userName: string;
    private _canEnter: boolean;

    constructor(userName: string, canEnter: boolean)
    {
        super(RoomWidgetLetUserInMessage.LET_USER_IN);

        this._userName = userName;
        this._canEnter = canEnter;
    }

    public get userName(): string
    {
        return this._userName;
    }

    public get canEnter(): boolean
    {
        return this._canEnter;
    }
}
