import { Dispatch, SetStateAction } from 'react';

export interface AvatarInfoWidgetDecorateViewProps
{
    userId: number;
    userName: string;
    roomIndex: number;
    setIsDecorating: Dispatch<SetStateAction<boolean>>;
}
