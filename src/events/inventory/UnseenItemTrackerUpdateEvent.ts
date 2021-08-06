import { NitroEvent } from '@nitrots/nitro-renderer';

export class UnseenItemTrackerUpdateEvent extends NitroEvent
{
    public static UPDATE_COUNT: string = 'UITUE_UPDATE_COUNTER';

    private _count: number;

    constructor(count: number)
    {
        super(UnseenItemTrackerUpdateEvent.UPDATE_COUNT);

        this._count = count;
    }

    public get count(): number
    {
        return this._count;
    }
}
