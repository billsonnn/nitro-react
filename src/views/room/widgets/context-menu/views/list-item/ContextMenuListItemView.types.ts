import { MouseEvent } from 'react';

export interface ContextMenuListItemViewProps
{
    className?: string;
    canSelect?: boolean;
    onClick: (event: MouseEvent) => void;
}
