import { ProviderProps } from 'react';
import { IChatEntry } from '../../chat-history/context/ChatHistoryContext.types';

export interface IHelpContext
{
    helpReportState: IHelpReportState;
    setHelpReportState: React.Dispatch<React.SetStateAction<IHelpReportState>>;
}

export interface IHelpReportState {
    reportedUserId: number;
    reportedChats: IChatEntry[];
    cfhCategory: number;
    cfhTopic: number;
    roomId: number;
    message: string;
    currentStep: number;
}

export const initialReportState: IHelpReportState =  {
    reportedUserId: -1,
    reportedChats: [],
    cfhCategory: -1,
    cfhTopic: -1,
    roomId: -1,
    message: '',
    currentStep: 0
}

export interface HelpContextProps extends ProviderProps<IHelpContext>
{

}
