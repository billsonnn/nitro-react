import { RoomWidgetUpdateRentableBotChatEvent } from '../../../../../../api';

export interface AvatarInfoRentableBotChatViewProps
{
    chatEvent: RoomWidgetUpdateRentableBotChatEvent;
    close(): void;
}
