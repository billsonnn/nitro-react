import { RoomWidgetUpdateEvent } from '../../../views/room/events/RoomWidgetUpdateEvent';

export class RoomWidgetCameraEvent extends RoomWidgetUpdateEvent
{
    public static SHOW_CAMERA: string = 'NE_SHOW_CAMERA';
    public static HIDE_CAMERA: string = 'NE_HIDE_CAMERA';
    public static TOGGLE_CAMERA: string = 'NE_TOGGLE_CAMERA';
}
