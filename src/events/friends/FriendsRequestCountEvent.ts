import { NitroEvent } from '@nitrots/nitro-renderer';

export class FriendsRequestCountEvent extends NitroEvent
{
    public static UPDATE_COUNT: string = 'FRCE_UPDATE_COUNT';

    private _count: number;

    constructor(count: number)
    {
        super(FriendsRequestCountEvent.UPDATE_COUNT);

        this._count = count;
    }

    public get count(): number
    {
        return this._count;
    }
}
