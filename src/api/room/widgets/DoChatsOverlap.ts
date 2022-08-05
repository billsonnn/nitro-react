import { ChatBubbleMessage } from './ChatBubbleMessage';

export const DoChatsOverlap = (a: ChatBubbleMessage, b: ChatBubbleMessage, additionalBTop: number, padding: number = 0) =>
{
    return !((((a.left + padding) + a.width) < (b.left + padding)) || ((a.left + padding) > ((b.left + padding) + b.width)) || ((a.top + a.height) < (b.top + additionalBTop)) || (a.top > ((b.top + additionalBTop) + b.height)));
}
      