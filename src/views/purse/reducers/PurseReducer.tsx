import { UserSubscriptionParser } from 'nitro-renderer';
import { Reducer } from 'react';
import { Currency } from '../common/Currency';

export interface IPurseState
{
    currencies: Currency[];
    clubSubscription: UserSubscriptionParser;
}

export interface IPurseAction
{
    type: string;
    payload: {
        currency?: Currency;
        currencies?: Currency[];
        clubSubscription?: UserSubscriptionParser;
    }
}

export class PurseActions
{
    public static SET_CURRENCY: string = 'PA_SET_CURRENCY';
    public static SET_CURRENCIES: string = 'PA_SET_CURRENCIES';
    public static SET_CLUB_SUBSCRIPTION: string = 'PA_SET_CLUB_SUBSCRIPTION';
}

export const initialPurse: IPurseState = {
    currencies: [],
    clubSubscription: null
}

export const PurseReducer: Reducer<IPurseState, IPurseAction> = (state, action) =>
{
    switch(action.type)
    {
        case PurseActions.SET_CURRENCY: {
            const updated = action.payload.currency;

            let didSet = false;

            const currencies = state.currencies.map(existing =>
            {
                if(existing.type !== updated.type) return existing;

                didSet = true;

                return { ...updated };
            });

            if(!didSet) currencies.push({ ...updated });

            return { ...state, currencies };
        }
        case PurseActions.SET_CURRENCIES: {
            const updated = action.payload.currencies;

            const currencies = state.currencies.filter(existing =>
            {
                if(existing.type !== -1) return null;

                return existing;
            });

            if(updated && updated.length) currencies.push(...updated);

            return { ...state, currencies };
        }
        case PurseActions.SET_CLUB_SUBSCRIPTION: {
            const clubSubscription = action.payload.clubSubscription;

            return { ...state, clubSubscription };
        }
        default:
            return state;
    }
}
