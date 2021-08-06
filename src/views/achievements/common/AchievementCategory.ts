import { AchievementData } from '@nitrots/nitro-renderer';

export class AchievementCategory
{
    private _name: string;
    private _achievements: AchievementData[];

    constructor(name: string)
    {
        this._name          = name;
        this._achievements  = [];
    }

    public get name(): string
    {
        return this._name;
    }

    public set name(name: string)
    {
        this._name = name;
    }

    public get achievements(): AchievementData[]
    {
        return this._achievements;
    }

    public set achievements(achievements: AchievementData[])
    {
        this._achievements = achievements;
    }
}
