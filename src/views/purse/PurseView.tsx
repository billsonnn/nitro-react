import { Map } from 'immutable';
import { UserCreditsEvent, UserCurrencyEvent, UserCurrencyUpdateEvent } from 'nitro-renderer';
import { UserCurrencyComposer } from 'nitro-renderer/src/nitro/communication/messages/outgoing/user/inventory/currency/UserCurrencyComposer';
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

    return (
        <FadeTransition inProp={ isReady } timeout={ 300 }>
            <div className="grid-container mb-1">
                <div className="grid-items grid-2">
                    { currencies && currencies.entrySeq().map(([ key, value ]) =>
                        {
                            return <CurrencyView key={ key } type={ parseInt(key) } amount={ value } />
                        }) }
                </div>
            </div>
        </FadeTransition>
    );
}
