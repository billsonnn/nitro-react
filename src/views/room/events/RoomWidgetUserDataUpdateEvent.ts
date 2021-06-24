import { RoomWidgetUpdateEvent } from './RoomWidgetUpdateEvent';

export class RoomWidgetUserDataUpdateEvent extends RoomWidgetUpdateEvent
{
    public static USER_DATA_UPDATED: string = 'RWUDUE_USER_DATA_UPDATED';

    constructor()
    {
        super(RoomWidgetUserDataUpdateEvent.USER_DATA_UPDATED);
    }
}
