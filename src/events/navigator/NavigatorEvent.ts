import { NitroEvent } from 'nitro-renderer';

export class NavigatorEvent extends NitroEvent
{
    public static SHOW_NAVIGATOR: string = 'NE_SHOW_NAVIGATOR';
    public static HIDE_NAVIGATOR: string = 'NE_HIDE_NAVIGATOR';
    public static TOGGLE_NAVIGATOR: string = 'NE_TOGGLE_NAVIGATOR';

    private _roomId: number;
    private _password: string;

    constructor(type: string, roomId: number = -1, password = null)
    {
        super(type);

        this._roomId = roomId;
        this._password = password;
    }

    public get roomId(): number
    {
        return this._roomId;
    }

    public get password(): string
    {
        return this._password;
    }
}
