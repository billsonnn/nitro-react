import { ActivityPointNotificationMessageEvent, FriendlyTime, HabboClubLevelEnum, UserCreditsEvent, UserCurrencyComposer, UserCurrencyEvent, UserSubscriptionComposer, UserSubscriptionEvent, UserSubscriptionParser } from '@nitrots/nitro-renderer';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { CreateLinkEvent, GetConfiguration, LocalizeText } from '../../api';
import { CREDITS, DUCKETS, PlaySound } from '../../api/utils/PlaySound';
import { Column, Flex, Grid, Text } from '../../common';
import { HcCenterEvent } from '../../events/hc-center/HcCenterEvent';
import { UserSettingsUIEvent } from '../../events/user-settings/UserSettingsUIEvent';
import { CreateMessageHook, dispatchUiEvent } from '../../hooks';
import { SendMessageHook } from '../../hooks/messages/message-event';
import { CurrencyIcon } from '../../views/shared/currency-icon/CurrencyIcon';
import { IPurse } from './common/IPurse';
import { Purse } from './common/Purse';
import { PurseContextProvider } from './PurseContext';
import { CurrencyView } from './views/CurrencyView';
import { SeasonalView } from './views/SeasonalView';

export let GLOBAL_PURSE: IPurse = null;

export const PurseView: FC<{}> = props =>
{
    const [ purse, setPurse ] = useState<IPurse>(new Purse());

    const displayedCurrencies = useMemo(() => GetConfiguration<number[]>('system.currency.types', []), []);
    const currencyDisplayNumberShort = useMemo(() => GetConfiguration<boolean>('currency.display.number.short', false), []);

    const getClubText = useMemo(() =>
    {
        if(!purse) return null;

        const totalDays = ((purse.clubPeriods * 31) + purse.clubDays);
        const minutesUntilExpiration = purse.minutesUntilExpiration;

        if(purse.clubLevel === HabboClubLevelEnum.NO_CLUB) return LocalizeText('purse.clubdays.zero.amount.text');

        else if((minutesUntilExpiration > -1) && (minutesUntilExpiration < (60 * 24))) return FriendlyTime.shortFormat(minutesUntilExpiration * 60);
        
        else return FriendlyTime.shortFormat(totalDays * 86400);
    }, [ purse ]);

    const getCurrencyElements = useCallback((offset: number, limit: number = -1, seasonal: boolean = false) =>
    {
        if(!purse || !purse.activityPoints || !purse.activityPoints.size) return null;

        const types = Array.from(purse.activityPoints.keys()).filter(type => (displayedCurrencies.indexOf(type) >= 0));

        let count = 0;

        while(count < offset)
        {
            types.shift();

            count++;
        }

        count = 0;

        const elements: JSX.Element[] = [];

        for(const type of types)
        {
            if((limit > -1) && (count === limit)) break;

            if(seasonal) elements.push(<SeasonalView key={ type } type={ type } amount={ purse.activityPoints.get(type) } />);
            else elements.push(<CurrencyView key={ type } type={ type } amount={ purse.activityPoints.get(type) } short={ currencyDisplayNumberShort } />);

            count++;
        }

        return elements;
    }, [ purse, displayedCurrencies, currencyDisplayNumberShort ]);

    const onUserCreditsEvent = useCallback((event: UserCreditsEvent) =>
    {
        const parser = event.getParser();

        setPurse(prevValue =>
            {
                const newValue = { ...prevValue };

                newValue.credits = parseFloat(parser.credits);

                if(prevValue.credits !== newValue.credits) PlaySound(CREDITS);

                return newValue;
            });
    }, []);

    CreateMessageHook(UserCreditsEvent, onUserCreditsEvent);

    const onUserCurrencyEvent = useCallback((event: UserCurrencyEvent) =>
    {
        const parser = event.getParser();

        setPurse(prevValue =>
            {
                const newValue = { ...prevValue };

                newValue.activityPoints = parser.currencies;

                return newValue;
            });
    }, []);

    CreateMessageHook(UserCurrencyEvent, onUserCurrencyEvent);

    const onActivityPointNotificationMessageEvent = useCallback((event: ActivityPointNotificationMessageEvent) =>
    {
        const parser = event.getParser();

        setPurse(prevValue =>
            {
                const newValue = { ...prevValue };

                newValue.activityPoints = new Map(newValue.activityPoints);

                newValue.activityPoints.set(parser.type, parser.amount);

                if(parser.type === 0) PlaySound(DUCKETS)

                return newValue;
            });
    }, []);

    CreateMessageHook(ActivityPointNotificationMessageEvent, onActivityPointNotificationMessageEvent);

    const onUserSubscriptionEvent = useCallback((event: UserSubscriptionEvent) =>
    {
        const parser = event.getParser();
        const productName = parser.productName;

        if((productName !== 'club_habbo') && (productName !== 'habbo_club')) return;

        setPurse(prevValue =>
            {
                const newValue = { ...prevValue };

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

    CreateMessageHook(UserSubscriptionEvent, onUserSubscriptionEvent);

    useEffect(() =>
    {
        GLOBAL_PURSE = purse;
    }, [ purse ]);

    useEffect(() =>
    {
        SendMessageHook(new UserSubscriptionComposer('habbo_club'));

        const interval = setInterval(() => SendMessageHook(new UserSubscriptionComposer('habbo_club')), 50000);

        return () => clearInterval(interval);
    }, [ purse ]);

    useEffect(() =>
    {
        SendMessageHook(new UserCurrencyComposer());
    }, []);

    if(!purse) return null;

    return (
        <PurseContextProvider value={ { purse } }>
            <Column className="nitro-purse-container" gap={ 1 }>
                <Flex className="nitro-purse rounded-bottom p-1">
                    <Grid fullWidth gap={ 1 }>
                        <Column justifyContent="center" size={ 6 } gap={ 0 }>
                            <CurrencyView type={ -1 } amount={ purse.credits } short={ currencyDisplayNumberShort } />
                            { getCurrencyElements(0, 2) }
                        </Column>
                        <Column center pointer size={ 4 } gap={ 1 } className="nitro-purse-subscription rounded" onClick={ event => dispatchUiEvent(new HcCenterEvent(HcCenterEvent.TOGGLE_HC_CENTER)) }>
                            <CurrencyIcon type="hc" />
                            <Text variant="white">{ getClubText }</Text>
                        </Column>
                        <Column justifyContent="center" size={ 2 } gap={ 0 }>
                            <Flex center pointer fullHeight className="nitro-purse-button p-1 rounded" onClick={ event => CreateLinkEvent('help/show') }>
                                <i className="icon icon-help"/>
                            </Flex>
                            <Flex center pointer fullHeight className="nitro-purse-button p-1 rounded" onClick={ event => dispatchUiEvent(new UserSettingsUIEvent(UserSettingsUIEvent.TOGGLE_USER_SETTINGS)) } >
                                <i className="icon icon-cog"/>
                            </Flex>
                        </Column>
                    </Grid>
                </Flex>
                { getCurrencyElements(2, -1, true) }
            </Column>
        </PurseContextProvider>
    );
}
