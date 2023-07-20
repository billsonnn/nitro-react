export interface ChatlogRecord
{
    timestamp?: string;
    habboId?: number;
    username?: string;
    message?: string;
    hasHighlighting?: boolean;
    isRoomInfo?: boolean;
    roomId?: number;
    roomName?: string;
}
