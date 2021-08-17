import { RoomWidgetUpdateInfostandRentableBotEvent } from '../../../../../../api';

export interface AvatarInfoWidgetRentableBotViewProps
{
    rentableBotData: RoomWidgetUpdateInfostandRentableBotEvent;
    close: () => void;
}

export interface BotChatOptions
{
    automaticChat: boolean;
    chatDelay: number;
    mixSentences: boolean;
}
