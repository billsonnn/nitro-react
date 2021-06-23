import { UserCreditsEvent, UserCurrencyEvent, UserCurrencyUpdateEvent } from 'nitro-renderer';
import { FC, useCallback } from 'react';
import { CreateMessageHook } from '../../hooks/messages/message-event';
import { Currency } from './common/Currency';
import { usePurseContext } from './context/PurseContext';
import { PurseMessageHandlerProps } from './PurseMessageHandler.types';
import { PurseActions } from './reducers/PurseReducer';
 
export const PurseMessageHandler: FC<PurseMessageHandlerProps> = props =>
{
    const { dispatchPurseState = null } = usePurseContext();

    const onUserCreditsEvent = useCallback((event: UserCreditsEvent) =>
    {
        const parser = event.getParser();

        dispatchPurseState({
            type: PurseActions.SET_CURRENCY,
            payload: {
                currency: { type: -1, amount: parseFloat(parser.credits) }
            }
        });
    }, [ dispatchPurseState ]);

    const onUserCurrencyEvent = useCallback((event: UserCurrencyEvent) =>
    {
        const parser = event.getParser();

        const currencies: Currency[] = [];

        for(const [ key, value ] of parser.currencies.entries()) currencies.push({ type: key, amount: value });

        dispatchPurseState({
            type: PurseActions.SET_CURRENCIES,
            payload: { currencies }
        });
    }, [ dispatchPurseState ]);

    const onUserCurrencyUpdateEvent = useCallback((event: UserCurrencyUpdateEvent) =>
    {
        const parser = event.getParser();

        dispatchPurseState({
            type: PurseActions.SET_CURRENCY,
            payload: {
                currency: { type: parser.type, amount: parser.amount }
            }
        });
    }, [ dispatchPurseState ]);

    CreateMessageHook(UserCreditsEvent, onUserCreditsEvent);
    CreateMessageHook(UserCurrencyEvent, onUserCurrencyEvent);
    CreateMessageHook(UserCurrencyUpdateEvent, onUserCurrencyUpdateEvent);

    return null;
}
