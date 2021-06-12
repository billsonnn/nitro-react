import { CurrencyIcon } from '../../currency-icon/CurrencyIcon';
import { CurrencyViewProps } from './CurrencyView.types';

export function CurrencyView(props: CurrencyViewProps): JSX.Element
{
    const { currency = null } = props;

    return (
        <div className="col pe-1 pb-1">
            <div className="nitro-currency p-1 d-flex rounded overflow-hidden">
                <div className="flex-grow-1 px-1 me-1 text-end">{ currency.amount }</div>
                <div className="icon px-1">
                    <CurrencyIcon type={ currency.type } />
                </div>
            </div>
        </div>
    );
}
