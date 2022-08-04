export interface IChatEntry
{
    id: number;
    entityId: number;
    name: string;
    look?: string;
    message?: string;
    entityType?: number;
    roomId: number;
    timestamp: string;
    type: number;
}
