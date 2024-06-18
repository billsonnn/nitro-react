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
        <Flex fullWidth className="bg-[#1c1c20f2] [box-shadow:inset_0_5px_#22222799,_inset_0_-4px_#12121599] p-2 rounded" justifyContent="between">
            <Text variant="white">{ LocalizeText(`purse.seasonal.currency.${ type }`) }</Text>
            <div className="flex gap-1">
                <Text variant="white">{ LocalizeFormattedNumber(amount) }</Text>
                <LayoutCurrencyIcon type={ type } />
            </div>
        </Flex>
    );
};
