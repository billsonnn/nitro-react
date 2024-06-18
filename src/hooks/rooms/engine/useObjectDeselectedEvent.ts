import { RoomWidgetUpdateRoomObjectEvent } from '../../../api';
import { useUiEvent } from '../../events';

export const useObjectDeselectedEvent = (handler: (event: RoomWidgetUpdateRoomObjectEvent) => void) =>
{
    useUiEvent(RoomWidgetUpdateRoomObjectEvent.OBJECT_DESELECTED, handler);
};
