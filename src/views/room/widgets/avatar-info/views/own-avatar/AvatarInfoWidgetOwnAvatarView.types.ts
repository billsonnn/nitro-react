import { RoomWidgetUpdateInfostandUserEvent } from '../../../../../../api';

export interface AvatarInfoWidgetOwnAvatarViewProps
{
    userData: RoomWidgetUpdateInfostandUserEvent;
    isDancing: boolean;
    close: () => void;
}
