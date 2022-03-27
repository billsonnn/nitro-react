import { RoomDataParser } from '@nitrots/nitro-renderer';

export class RoomInfoData
{
    private _enteredGuestRoom: RoomDataParser = null;
    private _createdRoomId: number = 0;
    private _currentRoomId: number = 0;
    private _currentRoomOwner: boolean = false;
    private _canRate: boolean = false;

    public get enteredGuestRoom(): RoomDataParser
    {
        return this._enteredGuestRoom;
    }

    public set enteredGuestRoom(data: RoomDataParser)
    {
        this._enteredGuestRoom = data;
    }

    public get createdRoomId(): number
    {
        return this._createdRoomId;
    }

    public set createdRoomId(id: number)
    {
        this._createdRoomId = id;
    }

    public get currentRoomId(): number
    {
        return this._currentRoomId;
    }

    public set currentRoomId(id: number)
    {
        this._currentRoomId = id;
    }

    public get currentRoomOwner(): boolean
    {
        return this._currentRoomOwner;
    }

    public set currentRoomOwner(flag: boolean)
    {
        this._currentRoomOwner = flag;
    }

    public get canRate(): boolean
    {
        return this._canRate;
    }

    public set canRate(flag: boolean)
    {
        this._canRate = flag;
    }
}
