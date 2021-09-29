import { MessengerThreadChat } from './MessengerThreadChat';

export class MessengerThreadChatGroup
{
    private _userId: number;
    private _chats: MessengerThreadChat[];

    constructor(userId: number)
    {
        this._userId = userId;
        this._chats = [];
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
}
