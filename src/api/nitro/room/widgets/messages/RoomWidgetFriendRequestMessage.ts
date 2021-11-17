import { RoomWidgetMessage } from './RoomWidgetMessage';

export class RoomWidgetFriendRequestMessage extends RoomWidgetMessage
{
    public static ACCEPT: string = 'RWFRM_ACCEPT';
    public static DECLINE: string = 'RMFRM_DECLINE';

    private _requestId: number;

    constructor(type: string, requestId: number)
    {
        super(type);

        this._requestId = requestId;
    }

    public get requestId(): number
    {
        return this._requestId;
    }
}
