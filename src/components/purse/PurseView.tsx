import { FriendlyTime, HabboClubLevelEnum, UserCurrencyComposer, UserSubscriptionComposer } from '@nitrots/nitro-renderer';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { CreateLinkEvent, GetConfiguration, LocalizeText } from '../../api';
import { Column, Flex, Grid, Text } from '../../common';
import { HcCenterEvent } from '../../events/hc-center/HcCenterEvent';
import { UserSettingsUIEvent } from '../../events/user-settings/UserSettingsUIEvent';
import { dispatchUiEvent } from '../../hooks';
import { SendMessageHook } from '../../hooks/messages/message-event';
import { CurrencyIcon } from '../../views/shared/currency-icon/CurrencyIcon';
import { IPurse } from './common/IPurse';
import { Purse } from './common/Purse';
import { PurseContextProvider } from './PurseContext';
import { PurseMessageHandler } from './PurseMessageHandler';
import { CurrencyView } from './views/CurrencyView';
import { SeasonalView } from './views/SeasonalView';

export let GLOBAL_PURSE: IPurse = null;

export const PurseView: FC<{}> = props =>
{
    const [ purse, setPurse ] = useState<IPurse>(new Purse());
    const [ updateId, setUpdateId ] = useState(-1);
    
    const handleUserSettingsClick = () => dispatchUiEvent(new UserSettingsUIEvent(UserSettingsUIEvent.TOGGLE_USER_SETTINGS));

    const handleHelpCenterClick = () => CreateLinkEvent('help/show');

    const handleHcCenterClick = () => dispatchUiEvent(new HcCenterEvent(HcCenterEvent.TOGGLE_HC_CENTER));

    const displayedCurrencies = useMemo(() => GetConfiguration<number[]>('system.currency.types', []), []);

    const currencyDisplayNumberShort = useMemo(() => GetConfiguration<boolean>('currency.display.number.short', false), []);

    const getClubText = useMemo(() =>
    {
        const totalDays = ((purse.clubPeriods * 31) + purse.clubDays);
        const minutesUntilExpiration = purse.minutesUntilExpiration;

        if(purse.clubLevel === HabboClubLevelEnum.NO_CLUB) return LocalizeText('purse.clubdays.zero.amount.text');

        else if((minutesUntilExpiration > -1) && (minutesUntilExpiration < (60 * 24))) return FriendlyTime.shortFormat(minutesUntilExpiration * 60);
        
        else return FriendlyTime.shortFormat(totalDays * 86400);
    }, [ purse ]);

    const getCurrencyElements = useCallback((offset: number, limit: number = -1, seasonal: boolean = false) =>
    {
        if(!purse.activityPoints.size) return null;

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

    useEffect(() =>
    {
        const purse = new Purse();

        GLOBAL_PURSE = purse;

        purse.notifier = () => setUpdateId(prevValue => (prevValue + 1));

        setPurse(purse);

        return () => (purse.notifier = null);
    }, []);

    useEffect(() =>
    {
        if(!purse) return;

        SendMessageHook(new UserCurrencyComposer());
    }, [ purse ]);

    useEffect(() =>
    {
        SendMessageHook(new UserSubscriptionComposer('habbo_club'));

        const interval = setInterval(() => SendMessageHook(new UserSubscriptionComposer('habbo_club')), 50000);

        return () => clearInterval(interval);
    }, [ purse ]);

    if(!purse) return null;

    return (
        <PurseContextProvider value={ { purse } }>
            <PurseMessageHandler />
            <Column className="nitro-purse-container" gap={ 1 }>
                <Flex className="nitro-purse rounded-bottom p-1">
                    <Grid fullWidth gap={ 1 }>
                        <Column justifyContent="center" size={ 6 } gap={ 0 }>
                            <CurrencyView type={ -1 } amount={ purse.credits } short={ currencyDisplayNumberShort } />
                            { getCurrencyElements(0, 2) }
                        </Column>
                        <Column center pointer size={ 4 } gap={ 1 } className="nitro-purse-subscription rounded" onClick={ handleHcCenterClick }>
                            <CurrencyIcon type="hc" />
                            <Text variant="white">{ getClubText }</Text>
                        </Column>
                        <Column justifyContent="center" size={ 2 } gap={ 0 }>
                            <Flex center pointer fullHeight className="nitro-purse-button p-1 rounded" onClick={ handleHelpCenterClick }>
                                <i className="icon icon-help"/>
                            </Flex>
                            <Flex center pointer fullHeight className="nitro-purse-button p-1 rounded" onClick={ handleUserSettingsClick } >
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
