import { RoomWidgetUpdateEvent } from 'nitro-renderer';

export class RoomWidgetRoomEngineUpdateEvent extends RoomWidgetUpdateEvent
{
    public static RWREUE_GAME_MODE: string = 'RWREUE_GAME_MODE';
    public static RWREUE_NORMAL_MODE: string = 'RWREUE_NORMAL_MODE';

    private _roomId: number = 0;

    constructor(k: string, _arg_2: number)
    {
        super(k);

        this._roomId = _arg_2;
    }

    public get roomId(): number
    {
        return this._roomId;
    }
}
