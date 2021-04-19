import { ReactNode } from 'react';
import { DraggableProps } from 'react-draggable';

export interface DraggableWindowProps
{
    handle: string;
    draggableOptions?: Partial<DraggableProps>;
    children?: ReactNode;
}
