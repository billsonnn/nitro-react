import { createContext, FC, ProviderProps, useContext } from 'react';
import { IChatHistoryState } from './common/IChatHistoryState';
import { IRoomHistoryState } from './common/IRoomHistoryState';

export interface IChatHistoryContext
{
    chatHistoryState: IChatHistoryState;
    roomHistoryState: IRoomHistoryState;
}

const ChatHistoryContext = createContext<IChatHistoryContext>({
    chatHistoryState: null,
    roomHistoryState: null
});

export const ChatHistoryContextProvider: FC<ProviderProps<IChatHistoryContext>> = props =>
{
    return <ChatHistoryContext.Provider value={ props.value }>{ props.children }</ChatHistoryContext.Provider>
}

export const useChatHistoryContext = () => useContext(ChatHistoryContext);
