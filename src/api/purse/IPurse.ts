export interface IPurse
{
    credits: number;
    activityPoints: Map<number, number>;
    clubDays: number;
    clubPeriods: number;
    hasClubLeft: boolean;
    isVip: boolean;
    pastClubDays: number;
    pastVipDays: number;
    isExpiring: boolean;
    minutesUntilExpiration: number;
    minutesSinceLastModified: number;
    clubLevel: number;
}
