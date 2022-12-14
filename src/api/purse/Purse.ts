import { GetTickerTime, HabboClubLevelEnum } from '@nitrots/nitro-renderer';
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
    private _minutesSinceLastModified: number = 0;
    private _lastUpdated: number = 0;

    public static from(purse: Purse): Purse
    {
        const newPurse = new Purse();

        newPurse._credits = purse._credits;
        newPurse._activityPoints = purse._activityPoints;
        newPurse._clubDays = purse._clubDays;
        newPurse._clubPeriods = purse._clubPeriods;
        newPurse._isVIP = purse._isVIP;
        newPurse._pastClubDays = purse._pastClubDays;
        newPurse._pastVipDays = purse._pastVipDays;
        newPurse._isExpiring = purse._isExpiring;
        newPurse._minutesUntilExpiration = purse._minutesUntilExpiration;
        newPurse._minutesSinceLastModified = purse._minutesSinceLastModified;
        newPurse._lastUpdated = purse._lastUpdated;

        return newPurse;
    }

    public get credits(): number
    {
        return this._credits;
    }

    public set credits(credits: number)
    {
        this._lastUpdated = GetTickerTime();
        this._credits = credits;
    }

    public get activityPoints(): Map<number, number>
    {
        return this._activityPoints;
    }

    public set activityPoints(k: Map<number, number>)
    {
        this._lastUpdated = GetTickerTime();
        this._activityPoints = k;
    }

    public get clubDays(): number
    {
        return this._clubDays;
    }

    public set clubDays(k: number)
    {
        this._lastUpdated = GetTickerTime();
        this._clubDays = k;
    }

    public get clubPeriods(): number
    {
        return this._clubPeriods;
    }

    public set clubPeriods(k: number)
    {
        this._lastUpdated = GetTickerTime();
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
        this._lastUpdated = GetTickerTime();
        this._pastClubDays = k;
    }

    public get pastVipDays(): number
    {
        return this._pastVipDays;
    }

    public set pastVipDays(k: number)
    {
        this._lastUpdated = GetTickerTime();
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
        var k: number = ((GetTickerTime() - this._lastUpdated) / (1000 * 60));
        var _local_2: number = (this._minutesUntilExpiration - k);
        return (_local_2 > 0) ? _local_2 : 0;
    }

    public set minutesUntilExpiration(k: number)
    {
        this._lastUpdated = GetTickerTime();
        this._minutesUntilExpiration = k;
    }

    public get minutesSinceLastModified(): number
    {
        return this._minutesSinceLastModified;
    }

    public set minutesSinceLastModified(k: number)
    {
        this._lastUpdated = GetTickerTime();
        this._minutesSinceLastModified = k;
    }

    public get lastUpdated(): number
    {
        return this._lastUpdated;
    }

    public get clubLevel(): number
    {
        if(((this.clubDays === 0) && (this.clubPeriods === 0))) return HabboClubLevelEnum.NO_CLUB;

        if(this.isVip) return HabboClubLevelEnum.VIP;

        return HabboClubLevelEnum.CLUB;
    }
}
