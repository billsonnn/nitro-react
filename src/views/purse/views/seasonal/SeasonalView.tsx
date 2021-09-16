import { FC } from 'react';
import { LocalizeFormattedNumber, LocalizeText } from '../../../../api';
import { CurrencyIcon } from '../../../shared/currency-icon/CurrencyIcon';
import { SeasonalViewProps } from './SeasonalView.types';

export const SeasonalView: FC<SeasonalViewProps> = props =>
{
    const { type = -1, amount = -1 } = props;

    return (
        <div className="nitro-seasonal-currency rounded d-flex justify-content-end">
            <div className="nitro-currency-text w-100 px-1 d-flex justify-content-between">
                <span className="seasonal-text">{ LocalizeText(`purse.seasonal.currency.${ type }`) }</span>
                <span>{ LocalizeFormattedNumber(amount) }</span>
            </div>
            <div>
                <CurrencyIcon type={ type } />
            </div>
        </div>
    );
}
