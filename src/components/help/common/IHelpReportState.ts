import { IChatEntry } from '../../../views/chat-history/context/ChatHistoryContext.types';

export interface IHelpReportState {
    reportedUserId: number;
    reportedChats: IChatEntry[];
    cfhCategory: number;
    cfhTopic: number;
    roomId: number;
    message: string;
    currentStep: number;
}
