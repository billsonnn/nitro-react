import { FC, useMemo } from 'react';
import { LocalizeFormattedNumber, LocalizeShortNumber } from '../../../api';
import { Flex, LayoutCurrencyIcon, Text } from '../../../common';

interface CurrencyViewProps
{
    type: number;
    amount: number;
    short: boolean;
}

export const CurrencyView: FC<CurrencyViewProps> = props =>
{
    const { type = -1, amount = -1, short = false } = props;

    const element = useMemo(() =>
    {
        return (
            <Flex pointer className="px-[2px] py-[3px]            rounded" gap={1} justifyContent="end">
                <Text grow textEnd truncate variant="white">{short ? LocalizeShortNumber(amount) : LocalizeFormattedNumber(amount)}</Text>
                <LayoutCurrencyIcon type={type} />
            </Flex>);
    }, [amount, short, type]);

    if (!short) return element;

    return (
        <></>
    );
}
