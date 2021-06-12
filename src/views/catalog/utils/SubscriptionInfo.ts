
export class SubscriptionInfo
{
    private _lastUpdated: number;

    constructor(
        public clubDays: number = 0,
        public clubPeriods: number = 0,
        public isVip: boolean = false,
        public pastDays: number = 0,
        public pastVipDays: number = 0) {}

    public get lastUpdated(): number
    {
        return this._lastUpdated;
    }
}
