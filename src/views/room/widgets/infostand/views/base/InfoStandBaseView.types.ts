import { MouseEvent, ReactNode } from 'react';

export interface InfoStandBaseViewProps
{
    headerText: ReactNode;
    onCloseClick: (event: MouseEvent) => void;
}
