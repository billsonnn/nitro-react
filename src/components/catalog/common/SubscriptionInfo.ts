
export class SubscriptionInfo
{
    private _lastUpdated: number;

    constructor(
        public readonly clubDays: number = 0,
        public readonly clubPeriods: number = 0,
        public readonly isVip: boolean = false,
        public readonly pastDays: number = 0,
        public readonly pastVipDays: number = 0) {}

    public get lastUpdated(): number
    {
        return this._lastUpdated;
    }
}
