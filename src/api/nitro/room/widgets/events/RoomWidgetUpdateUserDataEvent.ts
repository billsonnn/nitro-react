import { RoomWidgetUpdateEvent } from './RoomWidgetUpdateEvent';

export class RoomWidgetUpdateUserDataEvent extends RoomWidgetUpdateEvent
{
    public static USER_DATA_UPDATED: string = 'RWUUDE_USER_DATA_UPDATED';

    constructor()
    {
        super(RoomWidgetUpdateUserDataEvent.USER_DATA_UPDATED);
    }
}
