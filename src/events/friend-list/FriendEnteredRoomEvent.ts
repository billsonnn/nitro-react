import { NitroEvent } from '@nitrots/nitro-renderer';

export class FriendEnteredRoomEvent extends NitroEvent
{
    public static ENTERED: string = 'FERE_ENTERED';

    private _roomIndex: number;
    private _category: number;
    private _id: number;
    private _name: string;
    private _userType: number;

    constructor(roomIndex: number, category: number, id: number, name: string, userType: number)
    {
        super(FriendEnteredRoomEvent.ENTERED);

        this._roomIndex = roomIndex;
        this._category = category;
        this._id = id;
        this._name = name;
        this._userType = userType;
    }

    public get roomIndex(): number
    {
        return this._roomIndex;
    }

    public get category(): number
    {
        return this._category;
    }

    public get id(): number
    {
        return this._id;
    }

    public get name(): string
    {
        return this._name;
    }

    public get userType(): number
    {
        return this._userType;
    }
}
