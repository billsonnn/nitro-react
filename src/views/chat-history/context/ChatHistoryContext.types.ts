import { ProviderProps } from 'react';

export interface IChatHistoryContext
{
    chatHistoryState: IChatHistoryState;
    roomHistoryState: IRoomHistoryState;
}

export interface IChatHistoryState {
    chats: IChatEntry[];
    notifier: () => void
    notify(): void;
}

export interface IRoomHistoryState {
    roomHistory: IRoomHistoryEntry[];
    notifier: () => void
    notify(): void;
}

export interface IChatEntry {
    id: number;
    entityId: number;
    name: string;
    look?: string;
    message?: string;
    entityType?: number;
    roomId: number;
    timestamp: string;
    type: number;
}

export interface IRoomHistoryEntry {
    id: number;
    name: string;
}

export class ChatEntryType
{
    public static TYPE_CHAT = 1;
    public static TYPE_ROOM_INFO = 2;
}

export const CHAT_HISTORY_MAX = 1000;
export const ROOM_HISTORY_MAX = 10;

export interface ChatHistoryContextProps extends ProviderProps<IChatHistoryContext>
{

}
