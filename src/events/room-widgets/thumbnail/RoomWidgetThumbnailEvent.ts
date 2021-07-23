import { RoomWidgetUpdateEvent } from '../../../views/room/events/RoomWidgetUpdateEvent';

export class RoomWidgetThumbnailEvent extends RoomWidgetUpdateEvent
{
    public static SHOW_THUMBNAIL: string = 'NE_SHOW_THUMBNAIL';
    public static HIDE_THUMBNAIL: string = 'NE_HIDE_THUMBNAIL';
    public static TOGGLE_THUMBNAIL: string = 'NE_TOGGLE_THUMBNAIL';
}
