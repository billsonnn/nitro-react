import { FC, useMemo } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { LocalizeFormattedNumber, LocalizeShortNumber } from '../../../api';
import { Flex } from '../../../common';
import { CurrencyIcon } from '../../../views/shared/currency-icon/CurrencyIcon';

interface CurrencyViewProps
{
    type: number;
    amount: number;
    short: boolean;
}

export const CurrencyView: FC<CurrencyViewProps> = props =>
{
    const { type = -1, amount = -1, short = false } = props;

    const element = useMemo(() =>
    {
        return (
            <Flex justifyContent="end" className="nitro-currency nitro-purse-button rounded">
                <div className="px-1 text-end text-truncate nitro-currency-text align-self-center">{ short ? LocalizeShortNumber(amount) : LocalizeFormattedNumber(amount) }</div>
                <CurrencyIcon className="flex-shrink-0" type={ type } />
            </Flex>);
    }, [ amount, short, type ]);

    if(!short) return element;
    
    return (
        <OverlayTrigger
            placement="left"
            overlay={
                <Tooltip id={ `tooltip-${ type }` }>
                    { LocalizeFormattedNumber(amount) }
                </Tooltip>
            }>
            { element }
        </OverlayTrigger>
    );
}
