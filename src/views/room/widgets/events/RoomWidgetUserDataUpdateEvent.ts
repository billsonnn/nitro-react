import { RoomWidgetUpdateEvent } from 'nitro-renderer';

export class RoomWidgetUserDataUpdateEvent extends RoomWidgetUpdateEvent
{
    public static RWUDUE_USER_DATA_UPDATED: string = 'rwudue_user_data_updated';

    constructor()
    {
        super(RoomWidgetUserDataUpdateEvent.RWUDUE_USER_DATA_UPDATED);
    }
}
