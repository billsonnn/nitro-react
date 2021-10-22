import { createContext, FC, useContext } from 'react';
import { ChatHistoryContextProps, IChatHistoryContext } from './ChatHistoryContext.types';

const ChatHistoryContext = createContext<IChatHistoryContext>({
    chatHistoryState: null,
    roomHistoryState: null
});

export const ChatHistoryContextProvider: FC<ChatHistoryContextProps> = props =>
{
    return <ChatHistoryContext.Provider value={ props.value }>{ props.children }</ChatHistoryContext.Provider>
}

export const useChatHistoryContext = () => useContext(ChatHistoryContext);
