import { IRoomHistoryEntry, IRoomHistoryState } from '../context/ChatHistoryContext.types';

export class RoomHistoryState implements IRoomHistoryState
{
    private _roomHistory: IRoomHistoryEntry[];
    private _notifier: () => void;

    constructor()
    {
        this._roomHistory = [];
    }

    public get roomHistory(): IRoomHistoryEntry[]
    {
        return this._roomHistory;
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
