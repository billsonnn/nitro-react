import { MouseEvent } from 'react';

export interface NitroCardHeaderViewProps
{
    headerText: string;
    theme?: string;
    noCloseButton?: boolean;
    onCloseClick: (event: MouseEvent) => void;
}
