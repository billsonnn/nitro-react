import { MessengerChatMessage } from './MessengerChatMessage';
export class MessengerChat
{
    private _friendId: number;
    private _isRead: boolean;
    private _messages: MessengerChatMessage[];

    constructor(friendId: number, isRead: boolean = true)
    {
        this._friendId = friendId;
        this._isRead = isRead;
        this._messages = [];
    }

    public addMessage(): void
    {
        this._messages.push();
    }

    public get friendId(): number
    {
        return this._friendId;
    }

    public get isRead(): boolean
    {
        return this._isRead;
    }

    public get messages(): MessengerChatMessage[]
    {
        return this._messages;
    }
}
