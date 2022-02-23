import { IChatEntry } from './IChatEntry';
import { IChatHistoryState } from './IChatHistoryState';

export class ChatHistoryState implements IChatHistoryState
{
    private _chats: IChatEntry[];
    private _notifier: () => void;

    constructor()
    {
        this._chats = [];
    }

    public notify(): void
    {
        if(this._notifier) this._notifier();
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
}
