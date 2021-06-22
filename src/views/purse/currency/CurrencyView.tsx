import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { LocalizeShortNumber } from '../../../utils/LocalizeShortNumber';
import { CurrencyIcon } from '../../currency-icon/CurrencyIcon';
import { CurrencyViewProps } from './CurrencyView.types';

export function CurrencyView(props: CurrencyViewProps): JSX.Element
{
    const { currency = null } = props;

    return (
        <OverlayTrigger
        placement="left"
        overlay={
            <Tooltip id={`tooltip-${currency.type}`}>
                { currency.amount }
            </Tooltip>
        }>
            <div className="nitro-currency px-1 d-flex">
                <div className="px-1 text-end text-truncate nitro-currency-text">{LocalizeShortNumber(currency.amount)}</div>
                <div className="icon">
                    <CurrencyIcon type={ currency.type } />
                </div>
            </div>
        </OverlayTrigger>
    );
}
