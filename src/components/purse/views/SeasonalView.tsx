import { FC } from 'react';
import { LocalizeFormattedNumber, LocalizeText } from '../../../api';
import { Flex } from '../../../common';
import { CurrencyIcon } from '../../../views/shared/currency-icon/CurrencyIcon';

interface SeasonalViewProps
{
    type: number;
    amount: number;
}

export const SeasonalView: FC<SeasonalViewProps> = props =>
{
    const { type = -1, amount = -1 } = props;

    return (
        <Flex justifyContent="end" className="nitro-seasonal-currency rounded">
            <div className="nitro-currency-text w-100 px-1 d-flex justify-content-between">
                <span className="seasonal-text">{ LocalizeText(`purse.seasonal.currency.${ type }`) }</span>
                <span>{ LocalizeFormattedNumber(amount) }</span>
            </div>
            <div>
                <CurrencyIcon type={ type } />
            </div>
        </Flex>
    );
}
