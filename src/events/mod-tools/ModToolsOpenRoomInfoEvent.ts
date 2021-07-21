import { ModToolsEvent } from './ModToolsEvent';

export class ModToolsOpenRoomInfoEvent extends ModToolsEvent
{
    private _roomId: number;

    constructor(roomId: number)
    {
        super(ModToolsEvent.OPEN_ROOM_INFO);

        this._roomId = roomId;
    }

    public get roomId(): number
    {
        return this._roomId;
    }
}
