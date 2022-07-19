import { RoomWidgetUpdateRoomObjectEvent } from '../../../api';
import { useUiEvent } from '../../events';

export const useObjectSelectedEvent = (handler: (event: RoomWidgetUpdateRoomObjectEvent) => void) =>
{
    useUiEvent(RoomWidgetUpdateRoomObjectEvent.OBJECT_SELECTED, handler);
}
