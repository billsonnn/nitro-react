import { RoomWidgetUpdateEvent } from './RoomWidgetUpdateEvent';

export class RoomWidgetUpdateChatEvent extends RoomWidgetUpdateEvent
{
    public static CHAT_EVENT: string = 'RWUCE_CHAT_EVENT';
    public static CHAT_TYPE_SPEAK: number = 0;
    public static CHAT_TYPE_WHISPER: number = 1;
    public static CHAT_TYPE_SHOUT: number = 2;
    public static CHAT_TYPE_RESPECT: number = 3;
    public static CHAT_TYPE_PETRESPECT: number = 4;
    public static CHAT_TYPE_NOTIFY: number = 5;
    public static CHAT_TYPE_PETTREAT: number = 6;
    public static CHAT_TYPE_PETREVIVE: number = 7;
    public static CHAT_TYPE_PET_REBREED_FERTILIZE: number = 8;
    public static CHAT_TYPE_PET_SPEED_FERTILIZE: number = 9;
    public static CHAT_TYPE_BOT_SPEAK: number = 10;
    public static CHAT_TYPE_BOT_SHOUT: number = 11;
    public static CHAT_TYPE_BOT_WHISPER: number = 12;

    private _userId: number;
    private _text: string;
    private _chatType: number;
    private _userName: string;
    private _links: string[];
    private _userX: number;
    private _userY: number;
    private _userImage: string;
    private _userColor: number;
    private _roomId: number;
    private _userCategory: number;
    private _userType: number;
    private _petType: number;
    private _styleId: number;

    constructor(type: string, userId: number, text: string, userName: string, userCategory: number, userType: number, petType: number, userX: number, userY: number, userImage: string, userColor: number, roomId: number, chatType: number = 0, styleId: number = 0, links: string[] = null)
    {
        super(type);

        this._userId = userId;
        this._text = text;
        this._chatType = chatType;
        this._userName = userName;
        this._userCategory = userCategory;
        this._userType = userType;
        this._petType = petType;
        this._links = links;
        this._userX = userX;
        this._userY = userY;
        this._userImage = userImage;
        this._userColor = userColor;
        this._roomId = roomId;
        this._styleId = styleId;
    }

    public get userId(): number
    {
        return this._userId;
    }

    public get text(): string
    {
        return this._text;
    }

    public get chatType(): number
    {
        return this._chatType;
    }

    public get userName(): string
    {
        return this._userName;
    }

    public get userCategory(): number
    {
        return this._userCategory;
    }

    public get userType(): number
    {
        return this._userType;
    }

    public get petType(): number
    {
        return this._petType;
    }

    public get links(): string[]
    {
        return this._links;
    }

    public get userX(): number
    {
        return this._userX;
    }

    public get userY(): number
    {
        return this._userY;
    }

    public get userImage(): string
    {
        return this._userImage;
    }

    public get userColor(): number
    {
        return this._userColor;
    }

    public get roomId(): number
    {
        return this._roomId;
    }

    public get styleId(): number
    {
        return this._styleId;
    }
}
