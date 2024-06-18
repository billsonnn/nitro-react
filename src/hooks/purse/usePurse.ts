import { ActivityPointNotificationMessageEvent, UserCreditsEvent, UserCurrencyComposer, UserCurrencyEvent, UserSubscriptionComposer, UserSubscriptionEvent, UserSubscriptionParser } from '@nitrots/nitro-renderer';
import { useEffect, useMemo, useState } from 'react';
import { useBetween } from 'use-between';
import { CloneObject, ClubStatus, GetConfigurationValue, IPurse, PlaySound, Purse, SendMessageComposer, SoundNames } from '../../api';
import { useMessageEvent } from '../events';

const usePurseState = () =>
{
    const [ purse, setPurse ] = useState<IPurse>(new Purse());
    const hcDisabled = useMemo(() => GetConfigurationValue<boolean>('hc.disabled', false), []);

    const clubStatus = useMemo(() =>
    {
        if(hcDisabled || (purse.clubDays > 0)) return ClubStatus.ACTIVE;

        if((purse.pastVipDays > 0) || (purse.pastVipDays > 0)) return ClubStatus.EXPIRED;

        return ClubStatus.NONE;
    }, [ purse, hcDisabled ]);

    const getCurrencyAmount = (type: number) =>
    {
        if(type === -1) return purse.credits;

        for(const [ key, value ] of purse.activityPoints.entries())
        {
            if(key !== type) continue;

            return value;
        }

        return 0;
    };

    useMessageEvent<UserCreditsEvent>(UserCreditsEvent, event =>
    {
        const parser = event.getParser();

        setPurse(prevValue =>
        {
            const newValue = CloneObject(prevValue);

            newValue.credits = parseFloat(parser.credits);

            if(prevValue.credits !== newValue.credits) PlaySound(SoundNames.CREDITS);

            return newValue;
        });
    });

    useMessageEvent<UserCurrencyEvent>(UserCurrencyEvent, event =>
    {
        const parser = event.getParser();

        setPurse(prevValue =>
        {
            const newValue = CloneObject(prevValue);

            newValue.activityPoints = parser.currencies;

            return newValue;
        });
    });

    useMessageEvent<ActivityPointNotificationMessageEvent>(ActivityPointNotificationMessageEvent, event =>
    {
        const parser = event.getParser();

        setPurse(prevValue =>
        {
            const newValue = CloneObject(prevValue);

            newValue.activityPoints = new Map(newValue.activityPoints);

            newValue.activityPoints.set(parser.type, parser.amount);

            if(parser.type === 0) PlaySound(SoundNames.DUCKETS);

            return newValue;
        });
    });

    useMessageEvent<UserSubscriptionEvent>(UserSubscriptionEvent, event =>
    {
        const parser = event.getParser();
        const productName = parser.productName;

        if((productName !== 'club_habbo') && (productName !== 'habbo_club')) return;

        setPurse(prevValue =>
        {
            const newValue = CloneObject(prevValue);

            newValue.clubDays = Math.max(0, parser.daysToPeriodEnd);
            newValue.clubPeriods = Math.max(0, parser.periodsSubscribedAhead);
            newValue.isVip = parser.isVip;
            newValue.pastClubDays = parser.pastClubDays;
            newValue.pastVipDays = parser.pastVipDays;
            newValue.isExpiring = ((parser.responseType === UserSubscriptionParser.RESPONSE_TYPE_DISCOUNT_AVAILABLE) ? true : false);
            newValue.minutesUntilExpiration = parser.minutesUntilExpiration;
            newValue.minutesSinceLastModified = parser.minutesSinceLastModified;

            return newValue;
        });
    });

    useEffect(() =>
    {
        if(hcDisabled) return;

        SendMessageComposer(new UserSubscriptionComposer('habbo_club'));

        const interval = setInterval(() => SendMessageComposer(new UserSubscriptionComposer('habbo_club')), 50000);

        return () => clearInterval(interval);
    }, [ hcDisabled ]);

    useEffect(() =>
    {
        SendMessageComposer(new UserCurrencyComposer());
    }, []);

    return { purse, hcDisabled, clubStatus, getCurrencyAmount };
};

export const usePurse = () => useBetween(usePurseState);
