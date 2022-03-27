import { ChatBubbleMessage } from './ChatBubbleMessage';

export const DoChatsOverlap = (a: ChatBubbleMessage, b: ChatBubbleMessage, additionalBTop: number) =>
{
    return !(((a.left + a.width) < b.left) || (a.left > (b.left + b.width)) || ((a.top + a.height) < (b.top + additionalBTop)) || (a.top > ((b.top + additionalBTop) + b.height)));
}
      