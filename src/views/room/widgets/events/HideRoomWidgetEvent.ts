import { NitroEvent } from 'nitro-renderer';

export class HideRoomWidgetEvent extends NitroEvent
{
    public static HRWE_HIDE_ROOM_WIDGET: string = 'hrwe_hide_room_widget';

    private _Str_9477: string;

    constructor(k: string)
    {
        super(HideRoomWidgetEvent.HRWE_HIDE_ROOM_WIDGET);

        this._Str_9477 = k;
    }

    public get _Str_23558(): string
    {
        return this._Str_9477;
    }
}
