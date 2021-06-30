import { RoomWidgetUpdateEvent } from './RoomWidgetUpdateEvent';

export class RoomWidgetUpdateRentableBotChatEvent extends RoomWidgetUpdateEvent
{
    public static UPDATE_CHAT: string = 'RWURBCE_UPDATE_CHAT';

    private _objectId: number;
    private _category: number;
    private _botId: number;
    private _chat: string;
    private _automaticChat: boolean;
    private _chatDelay: number;
    private _mixSentences: boolean;

    constructor(objectId: number, category: number, botId: number, chat: string, automaticChat: boolean, chatDelay: number, mixSentences: boolean)
    {
        super(RoomWidgetUpdateRentableBotChatEvent.UPDATE_CHAT);

        this._objectId = objectId;
        this._category = category;
        this._botId = botId;
        this._chat = chat;
        this._automaticChat = automaticChat;
        this._chatDelay = chatDelay;
        this._mixSentences = mixSentences;
    }

    public get objectId(): number
    {
        return this._objectId;
    }

    public get category(): number
    {
        return this._category;
    }

    public get botId(): number
    {
        return this._botId;
    }

    public get chat(): string
    {
        return this._chat;
    }

    public get automaticChat(): boolean
    {
        return this._automaticChat;
    }

    public get chatDelay(): number
    {
        return this._chatDelay;
    }

    public get mixSentences(): boolean
    {
        return this._mixSentences;
    }
}
