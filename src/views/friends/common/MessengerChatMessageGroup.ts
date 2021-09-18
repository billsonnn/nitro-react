import { MessengerChatMessage } from './MessengerChatMessage';

export class MessengerChatMessageGroup
{
    private _userId: number;
    private _messages: MessengerChatMessage[];

    constructor(userId: number)
    {
        this._userId = userId;
        this._messages = [];
    }

    public addMessage(message: MessengerChatMessage): void
    {
        this._messages.push(message);
    }

    public get userId(): number
    {
        return this._userId;
    }

    public get messages(): MessengerChatMessage[]
    {
        return this._messages;
    }
}
