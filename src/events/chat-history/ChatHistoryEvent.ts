import { NitroEvent } from '@nitrots/nitro-renderer';

export class ChatHistoryEvent extends NitroEvent
{
    public static SHOW_CHAT_HISTORY: string = 'CHE_SHOW_CHAT_HISTORY';
    public static HIDE_CHAT_HISTORY: string = 'CHE_HIDE_CHAT_HISTORY';
    public static TOGGLE_CHAT_HISTORY: string = 'CHE_TOGGLE_CHAT_HISTORY';
}
