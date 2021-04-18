import { RoomWidgetUpdateEvent } from 'nitro-renderer';

export class RoomWidgetToolbarClickedUpdateEvent extends RoomWidgetUpdateEvent
{
    public static RWUE_REQUEST_ME_MENU_TOOLBAR_CLICKED: string = 'RWUE_REQUEST_ME_MENU_TOOLBAR_CLICKED';
    public static ICON_TYPE_ME_MENU: string = 'ICON_TYPE_ME_MENU';
    public static ICON_TYPE_ROOM_INFO: string = 'ICON_TYPE_ROOM_INFO';

    private _Str_22092: string;
    private _active: boolean = false;

    constructor(k: string, _arg_2: boolean = false)
    {
        super(RoomWidgetToolbarClickedUpdateEvent.RWUE_REQUEST_ME_MENU_TOOLBAR_CLICKED);

        this._Str_22092 = k;
        this._active = _arg_2;
    }

    public get active(): boolean
    {
        return this._active;
    }

    public get _Str_25981(): string
    {
        return this._Str_22092;
    }
}
