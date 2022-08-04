import { IChatEntry } from '../chat-history';

export interface IHelpReport
{
    reportType: number;
    reportedUserId: number;
    reportedChats: IChatEntry[];
    cfhCategory: number;
    cfhTopic: number;
    roomId: number;
    roomName: string;
    groupId: number;
    threadId: number;
    messageId: number;
    extraData: string;
    roomObjectId: number;
    message: string;
    currentStep: number;
}
