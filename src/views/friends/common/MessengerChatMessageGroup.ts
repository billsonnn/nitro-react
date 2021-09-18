import { MessengerChatMessage } from './MessengerChatMessage';

export class MessengerChatMessageGroup
{
    private _userId: number;
    private _messages: MessengerChatMessage[];
    private _isSystem: boolean;

    constructor(userId: number, isSystem: boolean)
    {
        this._userId = userId;
        this._messages = [];
        this._isSystem = isSystem;
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

    public get isSystem(): boolean
    {
        return this._isSystem;
    }
}
