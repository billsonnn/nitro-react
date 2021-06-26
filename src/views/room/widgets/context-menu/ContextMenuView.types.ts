export interface ContextMenuViewProps
{
    objectId: number;
    category: number;
    fades?: boolean;
    className?: string;
    close: () => void;
}
