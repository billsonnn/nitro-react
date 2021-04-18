import { RoomWidgetUpdateEvent } from 'nitro-renderer';

export class RoomWidgetChatInputContentUpdateEvent extends RoomWidgetUpdateEvent
{
    public static RWWCIDE_CHAT_INPUT_CONTENT: string = 'RWWCIDE_CHAT_INPUT_CONTENT';
    public static WHISPER: string = 'whisper';
    public static SHOUT: string = 'shout';

    private _Str_21134: string = '';
    private _userName: string = '';

    constructor(k: string, _arg_2: string)
    {
        super(RoomWidgetChatInputContentUpdateEvent.RWWCIDE_CHAT_INPUT_CONTENT);

        this._Str_21134 = k;
        this._userName = _arg_2;
    }

    public get _Str_23621(): string
    {
        return this._Str_21134;
    }

    public get userName(): string
    {
        return this._userName;
    }
}
