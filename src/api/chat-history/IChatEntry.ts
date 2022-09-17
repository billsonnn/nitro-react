export interface IChatEntry
{
    id: number;
    entityId: number;
    name: string;
    look?: string;
    message?: string;
    entityType?: number;
    style?: number;
    chatType?: number;
    imageUrl?: string;
    color?: string;
    roomId: number;
    timestamp: string;
    type: number;
}
