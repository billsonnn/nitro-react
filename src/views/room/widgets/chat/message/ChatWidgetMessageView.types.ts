import { ChatBubbleMessage } from '../utils/ChatBubbleMessage';

export interface ChatWidgetMessageViewProps
{
    chat: ChatBubbleMessage;
    makeRoom: (amount?: number, skipLast?: boolean) => void;
}
