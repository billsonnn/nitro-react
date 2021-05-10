import { MouseEvent } from 'react';

export interface NitroCardSimpleHeaderViewProps
{
    headerText: string;
    onCloseClick: (event: MouseEvent) => void;
}
