import { Key } from 'react';

export interface DraggableWindowProps
{
    uniqueKey?: Key;
    handleSelector?: string;
    position?: string;
    disableDrag?: boolean;
}

export class DraggableWindowPosition
{
    public static CENTER: string = 'DWP_CENTER';
    public static TOP_CENTER: string = 'DWP_TOP_CENTER';
    public static NOTHING: string = 'DWP_NOTHING';
}
