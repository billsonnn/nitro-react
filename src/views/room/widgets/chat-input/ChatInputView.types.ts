import { RoomWidgetProps } from '../RoomWidgets.types';

export interface ChatInputViewProps extends RoomWidgetProps
{
    
}

export class ChatInputMessageType
{
    public static CHAT_DEFAULT: number  = 0;
    public static CHAT_WHISPER: number  = 1;
    public static CHAT_SHOUT: number    = 2;
}
