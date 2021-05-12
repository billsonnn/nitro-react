import { useEffect, useState } from 'react';
import { TransitionAnimation } from '../../../transitions/TransitionAnimation';
import { TransitionAnimationTypes } from '../../../transitions/TransitionAnimation.types';
import { CurrencyIcon } from '../../../utils/currency-icon/CurrencyIcon';
import { CurrencyViewProps } from './CurrencyView.types';

export function CurrencyView(props: CurrencyViewProps): JSX.Element
{
    const { currency = null } = props;

    const [ showUp, setShowUp ] = useState(false);

    useEffect(() =>
    {
        setShowUp(true);
    }, [ currency ])

    return (
        <TransitionAnimation type={ TransitionAnimationTypes.FADE_IN } inProp={ showUp }>
            <div className="col pe-1 pb-1">
                <div className="nitro-currency p-1 d-flex rounded overflow-hidden">
                    <div className="flex-grow-1 px-1 me-1 text-end">{ currency.amount }</div>
                    <div className="icon px-1"><CurrencyIcon type={ currency.type } /></div>
                </div>
            </div>
        </TransitionAnimation>
    );
}
