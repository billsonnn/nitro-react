import { RoomWidgetUpdateEvent } from './RoomWidgetUpdateEvent';

export class RoomWidgetAvatarInfoEvent extends RoomWidgetUpdateEvent
{
    public static AVATAR_INFO: string = 'RWAIE_AVATAR_INFO';

    private _userId: number;
    private _userName: string;
    private _userType: number;
    private _roomIndex: number;
    private _allowNameChange: boolean;

    constructor(userId: number, userName: string, userType: number, roomIndex: number, allowNameChange: boolean)
    {
        super(RoomWidgetAvatarInfoEvent.AVATAR_INFO);

        this._userId = userId;
        this._userName = userName;
        this._userType = userType;
        this._roomIndex = roomIndex;
        this._allowNameChange = allowNameChange;
    }

    public get userId(): number
    {
        return this._userId;
    }

    public get userName(): string
    {
        return this._userName;
    }

    public get userType(): number
    {
        return this._userType;
    }

    public get roomIndex(): number
    {
        return this._roomIndex;
    }

    public get allowNameChange(): boolean
    {
        return this._allowNameChange;
    }
}
