import { Nitro, UserCreditsEvent, UserCurrencyComposer, UserCurrencyEvent, UserCurrencyUpdateEvent } from 'nitro-renderer';
import { useCallback, useEffect, useState } from 'react';
import { CreateMessageHook, SendMessageHook } from '../../hooks/messages/message-event';
import { TransitionAnimation } from '../../transitions/TransitionAnimation';
import { TransitionAnimationTypes } from '../../transitions/TransitionAnimation.types';
import { CurrencySet } from './currency/CurrencySet';
import { CurrencyView } from './currency/CurrencyView';
import { PurseViewProps } from './PurseView.types';

export function PurseView(props: PurseViewProps): JSX.Element
{
    const [ currencies, setCurrencies ] = useState<CurrencySet[]>([ new CurrencySet(-1, 0) ]);
    const [ isReady, setIsReady ] = useState(false);

    const displayedCurrencies = Nitro.instance.getConfiguration<number[]>('system.currency.types', []);

    const onUserCreditsEvent = useCallback((event: UserCreditsEvent) =>
    {
        const parser = event.getParser();

        updateCurrency(-1, parseFloat(parser.credits));
    }, []);

    const onUserCurrencyEvent = useCallback((event: UserCurrencyEvent) =>
    {
        const parser = event.getParser();

        for(const [ key, value ] of parser.currencies.entries()) updateCurrency(key, value);

        setIsReady(true);
    }, []);

    const onUserCurrencyUpdateEvent = useCallback((event: UserCurrencyUpdateEvent) =>
    {
        const parser = event.getParser();

        updateCurrency(parser.type, parser.amount)
    }, []);

    function updateCurrency(type: number, amount: number): void
    {
        setCurrencies(oldState =>
            {
                const newState: CurrencySet[] = [];

                let found = false;

                for(const set of oldState)
                {
                    if(set.type !== type)
                    {
                        newState.push(set);

                        continue;
                    }

                    newState.push(new CurrencySet(set.type, amount));

                    found = true;
                }

                if(!found) newState.push(new CurrencySet(type, amount));

                return newState;
            });
    }

    CreateMessageHook(UserCreditsEvent, onUserCreditsEvent);
    CreateMessageHook(UserCurrencyEvent, onUserCurrencyEvent);
    CreateMessageHook(UserCurrencyUpdateEvent, onUserCurrencyUpdateEvent);

    useEffect(() =>
    {
        SendMessageHook(new UserCurrencyComposer());
    }, []);

    return (
        <TransitionAnimation className="nitro-purse position-relative mb-1" type={ TransitionAnimationTypes.FADE_DOWN } inProp={ isReady } timeout={ 300 }>
            <div className="row px-0 mx-0">
                { currencies && currencies.map((set, index) =>
                    {
                        if(displayedCurrencies.indexOf(set.type) === -1) return null;

                        return <CurrencyView key={ index } currencySet={ set } />
                    }) }
            </div>
        </TransitionAnimation>
    );
}
