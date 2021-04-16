import { Map } from 'immutable';
import { Nitro, UserCreditsEvent, UserCurrencyComposer, UserCurrencyEvent, UserCurrencyUpdateEvent } from 'nitro-renderer';
import { useEffect, useState } from 'react';
import { CreateMessageHook, SendMessageHook } from '../../hooks/messages/message-event';
import { FadeTransition } from '../../transitions/FadeTransition';
import { CurrencyView } from './currency/CurrencyView';
import { PurseViewProps } from './PurseView.types';

export function PurseView(props: PurseViewProps): JSX.Element
{
    const [ currencies, setCurrencies ] = useState(Map({ '-1': 0 }));
    const [ isReady, setIsReady ] = useState(false);

    const onUserCreditsEvent = (event: UserCreditsEvent) =>
    {
        const parser = event.getParser();

        setCurrencies(currencies.set('-1', parseFloat(parser.credits)));
    };

    const onUserCurrencyEvent = (event: UserCurrencyEvent) =>
    {
        const parser = event.getParser();

        const map = {};

        for(const [ key, value ] of parser.currencies.entries())
        {
            map[key.toString()] = value;
        }

        setCurrencies(currencies.merge(map));
        setIsReady(true);
    };

    const onUserCurrencyUpdateEvent = (event: UserCurrencyUpdateEvent) =>
    {
        const parser = event.getParser();

        setCurrencies(currencies.set(parser.type.toString(), parser.amount));
    };

    CreateMessageHook(new UserCreditsEvent(onUserCreditsEvent));
    CreateMessageHook(new UserCurrencyEvent(onUserCurrencyEvent));
    CreateMessageHook(new UserCurrencyUpdateEvent(onUserCurrencyUpdateEvent));

    useEffect(() =>
    {
        SendMessageHook(new UserCurrencyComposer());
    }, []);

    const displayedCurrencies = Nitro.instance.getConfiguration<number[]>('system.currency.types', []);

    return (
        <FadeTransition inProp={ isReady } timeout={ 300 }>
            <div className="nitro-purse position-relative mb-1">
                <div className="row px-0 mx-0">
                    { currencies && currencies.entrySeq().map(([ key, value ]) =>
                        {
                            if(displayedCurrencies.indexOf(parseInt(key)) === -1) return null;

                            return <CurrencyView key={ key } type={ parseInt(key) } amount={ value } />
                        }) }
                </div>
            </div>
        </FadeTransition>
    );
}
