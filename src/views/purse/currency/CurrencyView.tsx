import { CurrencyIcon } from '../../../utils/currency-icon/CurrencyIcon';
import { CurrencyViewProps } from './CurrencyView.types';

export function CurrencyView(props: CurrencyViewProps): JSX.Element
{
    const { type = -1, amount = 0 } = props;

    return (
        <div className="d-flex bg-primary rounded shadow border border-black mb-1 p-1 nitro-currency">
            <div className="d-flex flex-grow-1 align-items-center justify-content-end">{ amount }</div>
            <div className="bg-secondary rounded ml-1"><CurrencyIcon type={ type } /></div>
        </div>
    );
}
