import { NitroEvent } from '@nitrots/nitro-renderer';

export class AchievementsUIUnseenCountEvent extends NitroEvent
{
    public static UNSEEN_COUNT: string = 'AUUCE_UNSEEN_COUNT';

    private _count: number;

    constructor(count: number)
    {
        super(AchievementsUIUnseenCountEvent.UNSEEN_COUNT);

        this._count = count;
    }

    public get count(): number
    {
        return this._count;
    }
}
