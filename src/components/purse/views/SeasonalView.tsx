import { FC } from 'react';
import { LocalizeFormattedNumber, LocalizeText } from '../../../api';
import { Flex, LayoutCurrencyIcon, Text } from '../../../common';

interface SeasonalViewProps
{
    type: number;
    amount: number;
}

export const SeasonalView: FC<SeasonalViewProps> = props =>
{
    const { type = -1, amount = -1 } = props;

    return (
        <Flex fullWidth justifyContent="between" className="nitro-purse-seasonal-currency p-2 rounded">
            <Text variant="white">{ LocalizeText(`purse.seasonal.currency.${ type }`) }</Text>
            <Flex gap={ 1 }>
                <Text variant="white">{ LocalizeFormattedNumber(amount) }</Text>
                <LayoutCurrencyIcon type={ type } />
            </Flex>
        </Flex>
    );
}
