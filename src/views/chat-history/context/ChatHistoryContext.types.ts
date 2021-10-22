import { Dispatch, ProviderProps } from 'react';
import { IChatHistoryAction, IChatHistoryState } from '../reducers/ChatHistoryReducer';

export interface IChatHistoryContext
{
    chatHistoryState: IChatHistoryState;
    dispatchChatHistoryState: Dispatch<IChatHistoryAction>;
}

export interface ChatHistoryContextProps extends ProviderProps<IChatHistoryContext>
{

}
