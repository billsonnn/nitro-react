import { LocalizeText } from './LocalizeText';

export class FriendlyTime
{
    private static MINUTE: number = 60;
    private static HOUR: number = (60 * FriendlyTime.MINUTE);
    private static DAY: number = (24 * FriendlyTime.HOUR);
    private static WEEK: number = (7 * FriendlyTime.DAY);
    private static MONTH: number = (30 * FriendlyTime.DAY);
    private static YEAR: number = (365 * FriendlyTime.DAY);


    public static format(seconds: number, key: string = '', threshold: number = 3): string
    {
        if(seconds > (threshold * FriendlyTime.YEAR)) return FriendlyTime.getLocalization(('friendlytime.years' + key), Math.round((seconds / FriendlyTime.YEAR)));

        if(seconds > (threshold * FriendlyTime.MONTH)) return FriendlyTime.getLocalization(('friendlytime.months' + key), Math.round((seconds / FriendlyTime.MONTH)));

        if(seconds > (threshold * FriendlyTime.DAY)) return FriendlyTime.getLocalization(('friendlytime.days' + key), Math.round((seconds / FriendlyTime.DAY)));

        if(seconds > (threshold * FriendlyTime.HOUR)) return FriendlyTime.getLocalization(('friendlytime.hours' + key), Math.round((seconds / FriendlyTime.HOUR)));

        if(seconds > (threshold * FriendlyTime.MINUTE)) return FriendlyTime.getLocalization(('friendlytime.minutes' + key), Math.round((seconds / FriendlyTime.MINUTE)));

        return FriendlyTime.getLocalization(('friendlytime.seconds' + key), Math.round(seconds));
    }

    public static shortFormat(seconds: number, key: string = '', threshold: number = 3): string
    {
        if(seconds > (threshold * FriendlyTime.YEAR)) return FriendlyTime.getLocalization(('friendlytime.years.short' + key), Math.round((seconds / FriendlyTime.YEAR)));

        if(seconds > (threshold * FriendlyTime.MONTH)) return FriendlyTime.getLocalization(('friendlytime.months.short' + key), Math.round((seconds / FriendlyTime.MONTH)));

        if(seconds > (threshold * FriendlyTime.DAY)) return FriendlyTime.getLocalization(('friendlytime.days.short' + key), Math.round((seconds / FriendlyTime.DAY)));

        if(seconds > (threshold * FriendlyTime.HOUR)) return FriendlyTime.getLocalization(('friendlytime.hours.short' + key), Math.round((seconds / FriendlyTime.HOUR)));

        if(seconds > (threshold * FriendlyTime.MINUTE)) return FriendlyTime.getLocalization(('friendlytime.minutes.short' + key), Math.round((seconds / FriendlyTime.MINUTE)));

        return FriendlyTime.getLocalization(('friendlytime.seconds.short' + key), Math.round(seconds));
    }

    public static getLocalization(key: string, amount: number): string
    {
        return LocalizeText(key, [ 'amount' ], [ amount.toString() ]);
    }
}
