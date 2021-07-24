import { FC } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { LocalizeShortNumber } from '../../../../utils/LocalizeShortNumber';
import { CurrencyIcon } from '../../../shared/currency-icon/CurrencyIcon';
import { CurrencyViewProps } from './CurrencyView.types';

export const CurrencyView: FC<CurrencyViewProps> = props =>
{
    const { type = -1, amount = -1 } = props;

    return (
        <OverlayTrigger
        placement="left"
        overlay={
            <Tooltip id={`tooltip-${ type }`}>
                { amount }
            </Tooltip>
        }>
            <div className="nitro-currency d-flex justify-content-end nitro-purse-button">
                <div className="px-1 text-end text-truncate nitro-currency-text align-self-center">{LocalizeShortNumber(amount)}</div>
                <CurrencyIcon className="flex-shrink-0" type={ type } />
            </div>
        </OverlayTrigger>
    );
}
