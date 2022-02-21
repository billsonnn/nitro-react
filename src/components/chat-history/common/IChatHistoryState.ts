import { IChatEntry } from './IChatEntry';

export interface IChatHistoryState
{
    chats: IChatEntry[];
    notifier: () => void
    notify(): void;
}
