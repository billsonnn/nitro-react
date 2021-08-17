import { RoomWidgetMessage } from './RoomWidgetMessage';

export class RoomWidgetChatSelectAvatarMessage extends RoomWidgetMessage
{
    public static MESSAGE_SELECT_AVATAR: string = 'RWCSAM_MESSAGE_SELECT_AVATAR';

    private _objectId: number;
    private _userName: string;
    private _roomId: number;

    constructor(type: string, objectId: number, userName: string, roomId: number)
    {
        super(type);

        this._objectId = objectId;
        this._userName = userName;
        this._roomId = roomId;
    }

    public get objectId(): number
    {
        return this._objectId;
    }

    public get userName(): string
    {
        return this._userName;
    }

    public get roomId(): number
    {
        return this._roomId;
    }
}
