import { RoomWidgetUpdateRoomObjectEvent } from '../../../api';
import { useUiEvent } from '../../events';

export const useObjectDoubleClickedEvent = (handler: (event: RoomWidgetUpdateRoomObjectEvent) => void) =>
{
    useUiEvent(RoomWidgetUpdateRoomObjectEvent.OBJECT_DOUBLE_CLICKED, handler);
}
