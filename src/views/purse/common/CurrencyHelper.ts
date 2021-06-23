import { Currency } from './Currency';

let lastCurrencies: Currency[] = [];

export function SetLastCurrencies(currencies: Currency[]): void
{
    lastCurrencies = currencies;
}

export function GetCurrencyAmount(type: number): number
{
    for(const currency of lastCurrencies)
    {
        if(currency.type !== type) continue;

        return currency.amount;
    }

    return 0;
}
