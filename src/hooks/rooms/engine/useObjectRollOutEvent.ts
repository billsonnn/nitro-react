import { RoomWidgetUpdateRoomObjectEvent } from '../../../api';
import { useUiEvent } from '../../events';

export const useObjectRollOutEvent = (handler: (event: RoomWidgetUpdateRoomObjectEvent) => void) =>
{
    useUiEvent(RoomWidgetUpdateRoomObjectEvent.OBJECT_ROLL_OUT, handler);
};
