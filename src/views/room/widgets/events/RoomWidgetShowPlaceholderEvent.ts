import { RoomWidgetUpdateEvent } from 'nitro-renderer';

export class RoomWidgetShowPlaceholderEvent extends RoomWidgetUpdateEvent
{
    public static RWSPE_SHOW_PLACEHOLDER: string = 'RWSPE_SHOW_PLACEHOLDER';
}
