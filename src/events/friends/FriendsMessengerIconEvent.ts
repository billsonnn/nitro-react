import { NitroEvent } from '@nitrots/nitro-renderer';

export class FriendsMessengerIconEvent extends NitroEvent
{
    public static UPDATE_ICON: string = 'FMIE_UPDATE_ICON';
    public static HIDE_ICON: number = 0;
    public static SHOW_ICON: number = 1;
    public static UNREAD_ICON: number = 2;

    private _iconType: number;

    constructor(type: string, subType: number = FriendsMessengerIconEvent.SHOW_ICON)
    {
        super(type);

        this._iconType = subType;
    }

    public get iconType(): number
    {
        return this._iconType;
    }
}
