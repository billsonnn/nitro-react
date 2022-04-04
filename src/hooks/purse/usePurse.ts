import { ActivityPointNotificationMessageEvent, UserCreditsEvent, UserCurrencyComposer, UserCurrencyEvent, UserSubscriptionComposer, UserSubscriptionEvent, UserSubscriptionParser } from '@nitrots/nitro-renderer';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useBetween } from 'use-between';
import { CloneObject, ClubStatus, GetConfiguration, IPurse, PlaySound, Purse, SendMessageComposer, SoundNames } from '../../api';
import { UseMessageEventHook } from '../messages';

const usePurseState = () =>
{
    const [ purse, setPurse ] = useState<IPurse>(new Purse());
    const hcDisabled = useMemo(() => GetConfiguration<boolean>('hc.disabled', false), []);

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
    }

    const onUserCreditsEvent = useCallback((event: UserCreditsEvent) =>
    {
        const parser = event.getParser();

        setPurse(prevValue =>
        {
            const newValue = CloneObject(prevValue);

            newValue.credits = parseFloat(parser.credits);

            if(prevValue.credits !== newValue.credits) PlaySound(SoundNames.CREDITS);

            return newValue;
        });
    }, []);

    UseMessageEventHook(UserCreditsEvent, onUserCreditsEvent);

    const onUserCurrencyEvent = useCallback((event: UserCurrencyEvent) =>
    {
        const parser = event.getParser();

        setPurse(prevValue =>
        {
            const newValue = CloneObject(prevValue);

            newValue.activityPoints = parser.currencies;

            return newValue;
        });
    }, []);

    UseMessageEventHook(UserCurrencyEvent, onUserCurrencyEvent);

    const onActivityPointNotificationMessageEvent = useCallback((event: ActivityPointNotificationMessageEvent) =>
    {
        const parser = event.getParser();

        setPurse(prevValue =>
        {
            const newValue = CloneObject(prevValue);

            newValue.activityPoints = new Map(newValue.activityPoints);

            newValue.activityPoints.set(parser.type, parser.amount);

            if(parser.type === 0) PlaySound(SoundNames.DUCKETS)

            return newValue;
        });
    }, []);

    UseMessageEventHook(ActivityPointNotificationMessageEvent, onActivityPointNotificationMessageEvent);

    const onUserSubscriptionEvent = useCallback((event: UserSubscriptionEvent) =>
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
    }, []);

    UseMessageEventHook(UserSubscriptionEvent, onUserSubscriptionEvent);

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
}

export const usePurse = () => useBetween(usePurseState);
