import { UserCurrencyComposer } from 'nitro-renderer';
import { FC, useCallback, useEffect, useMemo, useReducer } from 'react';
import { GetConfiguration } from '../../api';
import { NotificationCenterEvent } from '../../events';
import { dispatchUiEvent } from '../../hooks/events';
import { SendMessageHook } from '../../hooks/messages/message-event';
import { LocalizeText } from '../../utils/LocalizeText';
import { CurrencyIcon } from '../shared/currency-icon/CurrencyIcon';
import { SetLastCurrencies } from './common/CurrencyHelper';
import { PurseContextProvider } from './context/PurseContext';
import { CurrencyView } from './currency/CurrencyView';
import { PurseMessageHandler } from './PurseMessageHandler';
import { PurseViewProps } from './PurseView.types';
import { initialPurse, PurseReducer } from './reducers/PurseReducer';
import { SeasonalView } from './seasonal/SeasonalView';

export const PurseView: FC<PurseViewProps> = props =>
{
    const [ purseState, dispatchPurseState ] = useReducer(PurseReducer, initialPurse);
    const { currencies = [] } = purseState;
    
    const displayedCurrencies = useMemo(() =>
    {
        return GetConfiguration<number[]>('system.currency.types', []);
    }, []);

    useEffect(() =>
    {
        SendMessageHook(new UserCurrencyComposer());
    }, []);

    SetLastCurrencies(currencies);

    const toggleNotificationCenter = useCallback(() =>
    {
        dispatchUiEvent(new NotificationCenterEvent(NotificationCenterEvent.TOGGLE_NOTIFICATION_CENTER));
    }, []);

    return (
        <PurseContextProvider value={ { purseState, dispatchPurseState }}>
            <PurseMessageHandler />
            <div className="nitro-purse rounded-bottom d-flex flex-row justify-content-between">
                <div className="row mx-0 w-100">
                    <div className="col-6 px-0">
                        <div className="d-flex flex-column nitro-currencies">
                            { currencies && currencies.map((currency, index) =>
                                {
                                if (displayedCurrencies.indexOf(currency.type) === -1) return null;
                                
                                if (currency.type === -1 || currency.type === 0 || currency.type === 5) return <CurrencyView key={index} currency={currency} />;

                                return null;
                            })}
                        </div>
                    </div>
                    <div className="col-4 px-0">
                        <div className="nitro-purse-hc p-1 d-flex flex-column justify-content-center align-items-center h-100">
                            <CurrencyIcon className="flex-shrink-0" type="hc" />
                            <span>{LocalizeText('purse.clubdays.zero.amount.text')}</span>
                        </div>
                    </div>
                    <div className="col-2 px-0">
                        <div className="d-flex flex-column nitro-purse-buttons h-100 justify-content-center">
                            <div className="nitro-purse-button text-white h-100 text-center d-flex align-items-center justify-content-center"><i className="fas fa-life-ring"/></div>
                            <div className="nitro-purse-button text-white h-100 text-center d-flex align-items-center justify-content-center"><i className="fas fa-cogs"/></div>
                        </div>
                    </div>
                </div>
                {/*<div className="notification-button px-2" onClick={toggleNotificationCenter}>
                    <i className="fas fa-bars" />
                </div>*/}
            </div>
            { currencies && currencies.map((currency, index) =>
                {
                    if (displayedCurrencies.indexOf(currency.type) === -1) return null;
                                
                    if (currency.type === -1 || currency.type === 0 || currency.type === 5) return null;

                    return <SeasonalView key={index} currency={ currency } />;
                })}
        </PurseContextProvider>
    );
}
