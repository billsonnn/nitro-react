import { GroupType } from './GroupType';
import { MessengerThreadChat } from './MessengerThreadChat';

export class MessengerThreadChatGroup
{
    private _userId: number;
    private _chats: MessengerThreadChat[];
    private _type: number;

    constructor(userId: number, type = GroupType.PRIVATE_CHAT)
    {
        this._userId = userId;
        this._chats = [];
        this._type = type;
    }

    public addChat(message: MessengerThreadChat): void
    {
        this._chats.push(message);
    }

    public get userId(): number
    {
        return this._userId;
    }

    public get chats(): MessengerThreadChat[]
    {
        return this._chats;
    }

    public get type(): number
    {
        return this._type;
    }

    public set type(type: number)
    {
        this._type = type;
    }
}
