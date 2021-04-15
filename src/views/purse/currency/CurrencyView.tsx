import { CurrencyViewProps } from './CurrencyView.types';

export function CurrencyView(props: CurrencyViewProps): JSX.Element
{
    const { type = -1, amount = 0 } = props;

    return (
        <div className="d-flex item-detail bg-primary rounded border border-black shadow p-1">
            <div className="flex-grow-1 item-value">{ amount }</div>
            <div className="item-icon p-1 rounded bg-secondary">{ type }</div>
        </div>
    );
}
