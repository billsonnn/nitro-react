import { RoomWidgetUpdateEvent } from './RoomWidgetUpdateEvent';

export class RoomWidgetChatInputContentUpdateEvent extends RoomWidgetUpdateEvent
{
    public static CHAT_INPUT_CONTENT: string = 'RWCICUE_CHAT_INPUT_CONTENT';
    public static WHISPER: string = 'whisper';
    public static SHOUT: string = 'shout';

    private _chatMode: string = '';
    private _userName: string = '';

    constructor(k: string, _arg_2: string)
    {
        super(RoomWidgetChatInputContentUpdateEvent.CHAT_INPUT_CONTENT);

        this._chatMode = k;
        this._userName = _arg_2;
    }

    public get chatMode(): string
    {
        return this._chatMode;
    }

    public get userName(): string
    {
        return this._userName;
    }
}
