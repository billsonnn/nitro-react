import { RoomWidgetUpdateRoomObjectEvent } from '../../../api';
import { useUiEvent } from '../../events';

export const useObjectRollOverEvent = (handler: (event: RoomWidgetUpdateRoomObjectEvent) => void) =>
{
    useUiEvent(RoomWidgetUpdateRoomObjectEvent.OBJECT_ROLL_OVER, handler);
}
