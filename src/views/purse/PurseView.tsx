import { FriendlyTime, HabboClubLevelEnum, UserCurrencyComposer, UserSubscriptionComposer } from '@nitrots/nitro-renderer';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { GetConfiguration, LocalizeText } from '../../api';
import { HelpEvent } from '../../events/help/HelpEvent';
import { UserSettingsUIEvent } from '../../events/user-settings/UserSettingsUIEvent';
import { dispatchUiEvent } from '../../hooks';
import { SendMessageHook } from '../../hooks/messages/message-event';
import { CurrencyIcon } from '../shared/currency-icon/CurrencyIcon';
import { IPurse } from './common/IPurse';
import { Purse } from './common/Purse';
import { PurseContextProvider } from './context/PurseContext';
import { PurseMessageHandler } from './PurseMessageHandler';
import { CurrencyView } from './views/currency/CurrencyView';
import { SeasonalView } from './views/seasonal/SeasonalView';

export let GLOBAL_PURSE: IPurse = null;

export const PurseView: FC<{}> = props =>
{
    const [ purse, setPurse ] = useState<IPurse>(new Purse());
    const [ updateId, setUpdateId ] = useState(-1);
    
    const handleUserSettingsClick = useCallback(() =>
    {
        dispatchUiEvent(new UserSettingsUIEvent(UserSettingsUIEvent.TOGGLE_USER_SETTINGS));
    }, []);

    const handleHelpCenterClick = useCallback(() =>
    {
        dispatchUiEvent(new HelpEvent(HelpEvent.TOGGLE_HELP_CENTER));
    }, []);

    const displayedCurrencies = useMemo(() =>
    {
        return GetConfiguration<number[]>('system.currency.types', []);
    }, []);

    const currencyDisplayNumberShort = useMemo(() =>
    {
        return GetConfiguration<boolean>('currency.display.number.short', false);
    }, []);

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

    const getClubText = useCallback(() =>
    {
        const totalDays = ((purse.clubPeriods * 31) + purse.clubDays);
        const minutesUntilExpiration = purse.minutesUntilExpiration;

        if(purse.clubLevel === HabboClubLevelEnum.NO_CLUB)
        {
            return LocalizeText('purse.clubdays.zero.amount.text');
        }

        else if((minutesUntilExpiration > -1) && (minutesUntilExpiration < (60 * 24)))
        {
            return FriendlyTime.shortFormat(minutesUntilExpiration * 60);
        }

        else
        {
            return FriendlyTime.shortFormat(totalDays * 86400);
        }
    }, [ purse ]);

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

        const interval = setInterval(() =>
        {
            SendMessageHook(new UserSubscriptionComposer('habbo_club'));
        }, 50000);

        return () => clearInterval(interval);
    }, [ purse ]);

    if(!purse) return null;

    return (
        <PurseContextProvider value={ { purse } }>
            <PurseMessageHandler />
            <div className="nitro-purse rounded-bottom d-flex flex-row justify-content-between">
                <div className="row mx-0 w-100">
                    <div className="col-6 px-0">
                        <div className="d-flex flex-column nitro-currencies">
                            <CurrencyView type={ -1 } amount={ purse.credits } short={ currencyDisplayNumberShort } />
                            { getCurrencyElements(0, 2) }
                        </div>
                    </div>
                    <div className="col-4 px-0">
                        <div className="nitro-purse-hc rounded mx-1 p-1 d-flex flex-column justify-content-center align-items-center h-100">
                            <CurrencyIcon className="flex-shrink-0" type="hc" />
                            <span>{ getClubText() }</span>
                        </div>
                    </div>
                    <div className="col-2 px-0">
                        <div className="d-flex flex-column nitro-purse-buttons h-100 justify-content-center">
                            <div className="nitro-purse-button text-white h-100 text-center d-flex align-items-center justify-content-center cursor-pointer" onClick={ handleHelpCenterClick }><i className="icon icon-help"/></div>
                            <div className="nitro-purse-button text-white h-100 text-center d-flex align-items-center justify-content-center cursor-pointer" onClick={ handleUserSettingsClick } ><i className="fas fa-cogs"/></div>
                        </div>
                    </div>
                </div>
                {/*<div className="notification-button px-2" onClick={toggleNotificationCenter}>
                    <i className="fas fa-bars" />
                </div>*/}
            </div>
            { getCurrencyElements(2, -1, true) }
        </PurseContextProvider>
    );
}
