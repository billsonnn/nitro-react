import { GetRoomSession } from './GetRoomSession';

export function SendChatTypingMessage(isTyping: boolean): void
{
    GetRoomSession().sendChatTypingMessage(isTyping);
}
