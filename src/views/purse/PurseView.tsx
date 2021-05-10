import { UserCurrencyComposer } from 'nitro-renderer';
import { FC, useEffect, useMemo, useReducer } from 'react';
import { SendMessageHook } from '../../hooks/messages/message-event';
import { GetConfiguration } from '../../utils/GetConfiguration';
import { PurseContextProvider } from './context/PurseContext';
import { CurrencyView } from './currency/CurrencyView';
import { PurseMessageHandler } from './PurseMessageHandler';
import { PurseViewProps } from './PurseView.types';
import { initialPurse, PurseReducer } from './reducers/PurseReducer';
import { SetLastCurrencies } from './utils/CurrencyHelper';

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

    return (
        <PurseContextProvider value={ { purseState, dispatchPurseState }}>
            <PurseMessageHandler />
            <div className="row row-cols-2 g-0">
                { currencies && currencies.map((currency, index) =>
                    {
                        if(displayedCurrencies.indexOf(currency.type) === -1) return null;

                        return <CurrencyView key={ index } currency={ currency } />
                    }) }
            </div>
        </PurseContextProvider>
    );
}
