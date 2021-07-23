import { FC } from 'react';
import { LocalizeShortNumber } from '../../../utils/LocalizeShortNumber';
import { LocalizeText } from '../../../utils/LocalizeText';
import { CurrencyIcon } from '../../shared/currency-icon/CurrencyIcon';
import { SeasonalViewProps } from './SeasonalView.types';

export const SeasonalView: FC<SeasonalViewProps> = props =>
{
    const { currency = null } = props;

    return (
        <div className="nitro-seasonal-currency rounded d-flex justify-content-end">
            <div className="nitro-currency-text w-100 px-1 d-flex justify-content-between">
                <span>{ LocalizeText(`purse.seasonal.currency.${currency.type}`) }</span>
                <span>{ LocalizeShortNumber(currency.amount) }</span>
            </div>
            <div className="nitro-seasonal-icon">
                    <CurrencyIcon type={ currency.type } />
            </div>
        </div>
    );
}
