import { ChatBubbleMessage } from '../utils/ChatBubbleMessage';

export interface ChatWidgetMessageViewProps
{
    chat: ChatBubbleMessage;
    makeRoom: (chat: ChatBubbleMessage) => void;
}
