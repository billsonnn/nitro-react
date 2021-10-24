import { MouseEvent } from 'react';

export interface NitroCardHeaderViewProps
{
    headerText: string;
    theme?: string;
    onCloseClick: (event: MouseEvent) => void;
}
