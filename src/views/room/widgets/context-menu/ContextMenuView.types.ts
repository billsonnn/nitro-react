export interface ContextMenuViewProps
{
    objectId: number;
    category: number;
    userType?: number;
    fades?: boolean;
    className?: string;
    close: () => void;
}
