import { AchievementData } from '@nitrots/nitro-renderer';

export class AchievementCategory
{
    private _code: string;
    private _achievements: AchievementData[];

    constructor(code: string)
    {
        this._code = code;
        this._achievements = [];
    }

    public getProgress(): number
    {
        let progress = 0;

        for(const achievement of this._achievements)
        {
            progress += (achievement.finalLevel ? achievement.level : (achievement.level - 1));
        }

        return progress;
    }

    public getMaxProgress(): number
    {
        let progress = 0;

        for(const achievement of this._achievements)
        {
            progress += achievement.levelCount;
        }

        return progress;
    }

    public get code(): string
    {
        return this._code;
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
