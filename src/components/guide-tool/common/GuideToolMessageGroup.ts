import { GuideToolMessage } from './GuideToolMessage';

export class GuideToolMessageGroup
{
    private _userId: number;
    private _messages: GuideToolMessage[];

    constructor(userId: number)
    {
        this._userId = userId;
        this._messages = [];
    }

    public addChat(message: GuideToolMessage): void
    {
        this._messages.push(message);
    }

    public get userId(): number
    {
        return this._userId;
    }

    public get messages(): GuideToolMessage[]
    {
        return this._messages;
    }
}
