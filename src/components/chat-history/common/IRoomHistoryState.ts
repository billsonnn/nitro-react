import { IRoomHistoryEntry } from './IRoomHistoryEntry';

export interface IRoomHistoryState
{
    roomHistory: IRoomHistoryEntry[];
    notifier: () => void;
    notify: () => void;
}
