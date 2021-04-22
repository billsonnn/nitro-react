import { RoomWidgetUpdateEvent } from 'nitro-renderer';

export class RoomObjectNameEvent extends RoomWidgetUpdateEvent
{
    public static RWONE_TYPE: string = 'RWONE_TYPE';

    private _userId: number;
    private _category: number;
    private _userName: string;
    private _userType: number;
    private _roomIndex: number;

    constructor (k: number, _arg_2: number, _arg_3: string, _arg_4: number, _arg_5: number)
    {
        super(RoomObjectNameEvent.RWONE_TYPE);

        this._userId    = k;
        this._category  = _arg_2;
        this._userName  = _arg_3;
        this._userType  = _arg_4;
        this._roomIndex = _arg_5;
    }

    public get userId(): number
    {
        return this._userId;
    }

    public get category(): number
    {
        return this._category;
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
}
