import { RoomWidgetUpdateEvent } from './RoomWidgetUpdateEvent';

export class RoomWidgetRoomEngineUpdateEvent extends RoomWidgetUpdateEvent
{
    public static GAME_MODE: string = 'RWREUE_GAME_MODE';
    public static NORMAL_MODE: string = 'RWREUE_NORMAL_MODE';

    private _roomId: number = 0;

    constructor(type: string, roomId: number)
    {
        super(type);

        this._roomId = roomId;
    }

    public get roomId(): number
    {
        return this._roomId;
    }
}
