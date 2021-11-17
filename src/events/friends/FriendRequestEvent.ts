import { NitroEvent } from '@nitrots/nitro-renderer';

export class FriendRequestEvent extends NitroEvent
{
    public static ACCEPTED: string = 'FRE_ACCEPTED';
    public static DECLINED: string = 'FRE_DECLINED';

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
