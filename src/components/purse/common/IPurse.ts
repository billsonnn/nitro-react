export interface IPurse
{
    credits: number;
    activityPoints: Map<number, number>;
    clubDays: number;
    clubPeriods: number;
    _Str_13571: boolean;
    isVip: boolean;
    pastClubDays: number;
    pastVipDays: number;
    isExpiring: boolean;
    minutesUntilExpiration: number;
    minutesSinceLastModified: number;
    clubLevel: number;
    notifier: () => void
    notify(): void;
}
