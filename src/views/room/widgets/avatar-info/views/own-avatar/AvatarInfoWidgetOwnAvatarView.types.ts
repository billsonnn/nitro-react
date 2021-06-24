import { RoomWidgetUpdateInfostandUserEvent } from '../../../../events';

export interface AvatarInfoWidgetOwnAvatarViewProps
{
    userData: RoomWidgetUpdateInfostandUserEvent;
    isDancing: boolean;
    close: () => void;
}
