import { NitroEvent, RoomDataParser } from '@nitrots/nitro-renderer';

export class UpdateDoorStateEvent extends NitroEvent
{
    public static START_DOORBELL: string = 'UDSE_START_DOORBELL';
    public static START_PASSWORD: string = 'UDSE_START_PASSWORD';
    public static STATE_PENDING_SERVER: string = 'UDSE_STATE_PENDING_SERVER';
    public static UPDATE_STATE: string = 'UDSE_UPDATE_STATE';
    public static STATE_WAITING: string = 'UDSE_STATE_WAITING';
    public static STATE_NO_ANSWER: string = 'UDSE_STATE_NO_ANSWER';
    public static STATE_WRONG_PASSWORD: string = 'UDSE_STATE_WRONG_PASSWORD';
    public static STATE_ACCEPTED: string = 'UDSE_STATE_ACCEPTED';

    private _roomData: RoomDataParser

    constructor(type: string, roomData: RoomDataParser = null)
    {
        super(type);

        this._roomData = roomData;
    }

    public get roomData(): RoomDataParser
    {
        return this._roomData;
    }
}
