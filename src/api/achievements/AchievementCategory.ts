import { AchievementData } from '@nitrots/nitro-renderer';
import { GetAchievementCategoryProgress } from '.';
import { GetAchievementCategoryMaxProgress } from './GetAchievementCategoryMaxProgress';
import { IAchievementCategory } from './IAchievementCategory';

export class AchievementCategory implements IAchievementCategory
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
        return GetAchievementCategoryProgress(this);
    }

    public getMaxProgress(): number
    {
        return GetAchievementCategoryMaxProgress(this);
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
