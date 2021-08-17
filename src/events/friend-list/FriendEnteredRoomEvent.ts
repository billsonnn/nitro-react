import { RoomWidgetObjectNameEvent } from '../../api';

export class FriendEnteredRoomEvent extends RoomWidgetObjectNameEvent
{
    public static ENTERED: string = 'FERE_ENTERED';

    constructor(roomIndex: number, category: number, id: number, name: string, userType: number)
    {
        super(FriendEnteredRoomEvent.ENTERED, roomIndex, category, id, name, userType);
    }
}
