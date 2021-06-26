import { RoomWidgetUpdateInfostandRentableBotEvent } from '../../../../events';

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
