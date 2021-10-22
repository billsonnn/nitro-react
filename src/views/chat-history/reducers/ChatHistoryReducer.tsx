import { Reducer } from 'react';

export interface IChatHistoryState {
    chats: IChatEntry[];
    roomHistory: IRoomHistoryEntry[];
}

export interface IChatEntry {
    id: number;
    name: string;
    look?: string;
    message?: string;
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

export interface IChatHistoryAction
{
    type: string;
    payload: {
        chats?: IChatEntry[];
        roomHistory?: IRoomHistoryEntry[];
    }
}

export class ChatHistoryAction
{
    public static SET_CHATS: string = 'CHA_SET_CHATS';
    public static SET_ROOM_HISTORY: string = 'CHA_SET_ROOM_HISTORY';
}

export const initialChatHistory: IChatHistoryState = {
    chats: [],
    roomHistory: []
};

export const CHAT_HISTORY_MAX = 1000;
export const ROOM_HISTORY_MAX = 10;

export const ChatHistoryReducer: Reducer<IChatHistoryState, IChatHistoryAction> = (state, action) =>
{
    switch(action.type)
    {
        case ChatHistoryAction.SET_CHATS: {
            const chats = (action.payload.chats || state.chats || null);

            return { ...state, chats };
        }
        case ChatHistoryAction.SET_ROOM_HISTORY: {
            const roomHistory = (action.payload.roomHistory || state.roomHistory || null);

            return { ...state, roomHistory };
        }
    }
}
