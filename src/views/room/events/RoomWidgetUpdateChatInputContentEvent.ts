import { RoomWidgetUpdateEvent } from './RoomWidgetUpdateEvent';

export class RoomWidgetUpdateChatInputContentEvent extends RoomWidgetUpdateEvent
{
    public static CHAT_INPUT_CONTENT: string = 'RWUCICE_CHAT_INPUT_CONTENT';
    public static WHISPER: string = 'whisper';
    public static SHOUT: string = 'shout';

    private _chatMode: string = '';
    private _userName: string = '';

    constructor(chatMode: string, userName: string)
    {
        super(RoomWidgetUpdateChatInputContentEvent.CHAT_INPUT_CONTENT);

        this._chatMode = chatMode;
        this._userName = userName;
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
