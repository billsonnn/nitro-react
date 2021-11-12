import { ModToolsEvent } from './ModToolsEvent';

export class ModToolsOpenRoomChatlogEvent extends ModToolsEvent
{
    private _roomId: number;

    constructor(roomId: number)
    {
        super(ModToolsEvent.OPEN_ROOM_CHATLOG);

        this._roomId = roomId;
    }

    public get roomId(): number
    {
        return this._roomId;
    }
}
