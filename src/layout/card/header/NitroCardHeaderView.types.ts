import { MouseEvent } from 'react';

export interface NitroCardHeaderViewProps
{
    headerText: string;
    onCloseClick: (event: MouseEvent) => void;
}
