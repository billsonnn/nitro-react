import { HabboClubLevelEnum } from '@nitrots/nitro-renderer';
import { GetNitroInstance } from '../../../api';
import { IPurse } from './IPurse';

export class Purse implements IPurse
{
    private _credits: number = 0;
    private _activityPoints: Map<number, number> = new Map();
    private _clubDays: number = 0;
    private _clubPeriods: number = 0;
    private _isVIP: boolean = false;
    private _pastClubDays: number = 0;
    private _pastVipDays: number = 0;
    private _isExpiring: boolean = false;
    private _minutesUntilExpiration: number = 0;
    private _minutesSinceLastModified: number;
    private _lastUpdated: number;
    private _notifier: () => void;

    public get credits(): number
    {
        return this._credits;
    }

    public set credits(credits: number)
    {
        this._lastUpdated = GetNitroInstance().time;
        this._credits = credits;
    }

    public get activityPoints(): Map<number, number>
    {
        return this._activityPoints;
    }

    public set activityPoints(k: Map<number, number>)
    {
        this._lastUpdated = GetNitroInstance().time;
        this._activityPoints = k;
    }

    public get clubDays(): number
    {
        return this._clubDays;
    }

    public set clubDays(k: number)
    {
        this._lastUpdated = GetNitroInstance().time;
        this._clubDays = k;
    }

    public get clubPeriods(): number
    {
        return this._clubPeriods;
    }

    public set clubPeriods(k: number)
    {
        this._lastUpdated = GetNitroInstance().time;
        this._clubPeriods = k;
    }

    public get _Str_13571(): boolean
    {
        return (this._clubDays > 0) || (this._clubPeriods > 0);
    }

    public get isVip(): boolean
    {
        return this._isVIP;
    }

    public set isVip(k: boolean)
    {
        this._isVIP = k;
    }

    public get pastClubDays(): number
    {
        return this._pastClubDays;
    }

    public set pastClubDays(k: number)
    {
        this._lastUpdated = GetNitroInstance().time;
        this._pastClubDays = k;
    }

    public get pastVipDays(): number
    {
        return this._pastVipDays;
    }

    public set pastVipDays(k: number)
    {
        this._lastUpdated = GetNitroInstance().time;
        this._pastVipDays = k;
    }

    public get isExpiring(): boolean
    {
        return this._isExpiring;
    }

    public set isExpiring(k: boolean)
    {
        this._isExpiring = k;
    }

    public get minutesUntilExpiration(): number
    {
        var k: number = ((GetNitroInstance().time - this._lastUpdated) / (1000 * 60));
        var _local_2: number = (this._minutesUntilExpiration - k);
        return (_local_2 > 0) ? _local_2 : 0;
    }

    public set minutesUntilExpiration(k: number)
    {
        this._lastUpdated = GetNitroInstance().time;
        this._minutesUntilExpiration = k;
    }

    public get minutesSinceLastModified(): number
    {
        return this._minutesSinceLastModified;
    }

    public set minutesSinceLastModified(k: number)
    {
        this._lastUpdated = GetNitroInstance().time;
        this._minutesSinceLastModified = k;
    }

    public get lastUpdated(): number
    {
        return this._lastUpdated;
    }

    public get notifier(): () => void
    {
        return this._notifier;
    }

    public set notifier(notifier: () => void)
    {
        this._notifier = notifier;
    }

    public get clubLevel(): number
    {
        if(((this.clubDays === 0) && (this.clubPeriods === 0))) return HabboClubLevelEnum.NO_CLUB;

        if(this.isVip) return HabboClubLevelEnum.VIP;

        return HabboClubLevelEnum.CLUB;
    }

    public notify(): void
    {
        if(this._notifier) this._notifier();
    }
}
