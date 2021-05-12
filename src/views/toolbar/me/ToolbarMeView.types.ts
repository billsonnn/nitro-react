import { Dispatch, SetStateAction } from 'react';

export interface ToolbarMeViewProps
{
    setMeExpanded: Dispatch<SetStateAction<boolean>>;
    handleToolbarItemClick: (item: string) => void;
}
