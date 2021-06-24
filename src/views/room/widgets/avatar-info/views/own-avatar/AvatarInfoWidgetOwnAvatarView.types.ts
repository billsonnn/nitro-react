import { Dispatch, SetStateAction } from 'react';
import { RoomWidgetUpdateInfostandUserEvent } from '../../../../events';

export interface AvatarInfoWidgetOwnAvatarViewProps
{
    userData: RoomWidgetUpdateInfostandUserEvent;
    isDancing: boolean;
    setIsDecorating: Dispatch<SetStateAction<boolean>>;
    close: () => void;
}
