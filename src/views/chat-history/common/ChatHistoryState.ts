import { IChatEntry, IChatHistoryState } from '../context/ChatHistoryContext.types';

export class ChatHistoryState implements IChatHistoryState
{
    private _chats: IChatEntry[];
    private _notifier: () => void;

    constructor()
    {
        this._chats = [];
    }

    public get chats(): IChatEntry[]
    {
        return this._chats;
    }

    public get notifier(): () => void
    {
        return this._notifier;
    }

    public set notifier(notifier: () => void)
    {
        this._notifier = notifier;
    }

    notify(): void
    {
        if(this._notifier) this._notifier();
    }
}
