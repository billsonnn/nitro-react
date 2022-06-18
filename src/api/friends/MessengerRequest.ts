import { FriendRequestData } from '@nitrots/nitro-renderer';

export class MessengerRequest
{
    private _id: number;
    private _name: string;
    private _requesterUserId: number;
    private _figureString: string;

    public populate(data: FriendRequestData): boolean
    {
        if(!data) return false;

        this._id = data.requestId;
        this._name = data.requesterName;
        this._figureString = data.figureString;
        this._requesterUserId = data.requesterUserId;

        return true;
    }

    public get id(): number
    {
        return this._id;
    }

    public get name(): string
    {
        return this._name;
    }

    public get requesterUserId(): number
    {
        return this._requesterUserId;
    }

    public get figureString(): string
    {
        return this._figureString;
    }
}
