import { FC, useMemo } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { LocalizeFormattedNumber, LocalizeShortNumber } from '../../../../api';
import { CurrencyIcon } from '../../../shared/currency-icon/CurrencyIcon';
import { CurrencyViewProps } from './CurrencyView.types';

export const CurrencyView: FC<CurrencyViewProps> = props =>
{
    const { type = -1, amount = -1, short = false } = props;

    const element = useMemo(() =>
    {
        return (<div className="nitro-currency d-flex justify-content-end nitro-purse-button">
                    <div className="px-1 text-end text-truncate nitro-currency-text align-self-center">{ short ? LocalizeShortNumber(amount) : LocalizeFormattedNumber(amount) }</div>
                    <CurrencyIcon className="flex-shrink-0" type={ type } />
                </div>);
    }, [ amount, short, type ]);

    if(!short) return element;
    
    return (
        <OverlayTrigger
        placement="left"
        overlay={
            <Tooltip id={`tooltip-${ type }`}>
                { amount }
            </Tooltip>
        }>
            { element }
        </OverlayTrigger>
    );
}
