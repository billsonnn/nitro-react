import { IChatHistoryState } from './IChatHistoryState';

let GLOBAL_CHATS: IChatHistoryState = null;

export const SetChatHistory = (chatHistory: IChatHistoryState) => (GLOBAL_CHATS = chatHistory);

export const GetChatHistory = () => GLOBAL_CHATS; 
