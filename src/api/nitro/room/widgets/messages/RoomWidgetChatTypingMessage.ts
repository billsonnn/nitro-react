import { RoomWidgetMessage } from './RoomWidgetMessage';

export class RoomWidgetChatTypingMessage extends RoomWidgetMessage
{
    public static TYPING_STATUS: string = 'RWCTM_TYPING_STATUS';

    private _isTyping: boolean;

    constructor(isTyping: boolean)
    {
        super(RoomWidgetChatTypingMessage.TYPING_STATUS);

        this._isTyping = isTyping;
    }

    public get isTyping(): boolean
    {
        return this._isTyping;
    }
}
