import { GetNitroInstance } from '../../../api';
import { IPurse } from './IPurse';

export class Purse implements IPurse
{
    private _credits: number = 0;
    private _activityPoints: Map<number, number>;
    private _clubDays: number = 0;
    private _clubPeriods: number = 0;
    private _isVIP: boolean = false;
    private _pastClubDays: number = 0;
    private _pastVipDays: number = 0;
    private _isExpiring: boolean = false;
    private _minutesUntilExpiration: number = 0;
    private _minutesSinceLastModified: number;
    private _lastUpdated: number;

    public get credits(): number
    {
        return this._credits;
    }

    public set credits(k: number)
    {
        this._lastUpdated = GetNitroInstance().time;
        this._credits = k;
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

    public get _Str_3738(): boolean
    {
        return this._isVIP;
    }

    public get _Str_14389(): boolean
    {
        return this._isExpiring;
    }

    public set _Str_14389(k: boolean)
    {
        this._isExpiring = k;
    }

    public set _Str_3738(k: boolean)
    {
        this._isVIP = k;
    }

    public get _Str_6288(): number
    {
        return this._pastClubDays;
    }

    public set _Str_6288(k: number)
    {
        this._lastUpdated = GetNitroInstance().time;
        this._pastClubDays = k;
    }

    public get _Str_4605(): number
    {
        return this._pastVipDays;
    }

    public set _Str_4605(k: number)
    {
        this._lastUpdated = GetNitroInstance().time;
        this._pastVipDays = k;
    }

    public get _Str_18527(): Map<number, number>
    {
        return this._activityPoints;
    }

    public set _Str_18527(k: Map<number, number>)
    {
        this._lastUpdated = GetNitroInstance().time;
        this._activityPoints = k;
    }

    public _Str_5590(k: number): number
    {
        return this._activityPoints[k];
    }

    public set _Str_4458(k: number)
    {
        this._lastUpdated = GetNitroInstance().time;
        
        this._minutesUntilExpiration = k;
    }

    public get _Str_4458(): number
    {
        const k = ((GetNitroInstance().time - this._lastUpdated) / (1000 * 60));
        const _local_2 = (this._minutesUntilExpiration - k);

        return (_local_2 > 0) ? _local_2 : 0;
    }

    public set _Str_6312(k: number)
    {
        this._lastUpdated = GetNitroInstance().time;
        this._minutesSinceLastModified = k;
    }

    public get _Str_6312(): number
    {
        return this._minutesSinceLastModified;
    }

    public get _Str_26225(): number
    {
        return this._lastUpdated;
    }
}
