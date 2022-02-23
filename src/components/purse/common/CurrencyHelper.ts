import { GLOBAL_PURSE } from '../PurseView';

export function GetCurrencyAmount(type: number): number
{
    const purse = GLOBAL_PURSE;

    if(type === -1) return purse.credits;

    for(const [ key, value ] of purse.activityPoints.entries())
    {
        if(key !== type) continue;

        return value;
    }

    return 0;
}
