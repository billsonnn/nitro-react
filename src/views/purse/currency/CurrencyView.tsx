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
                <div className="d-flex bg-primary rounded border overflow-hidden">
                    <div className="d-flex flex-grow-1 align-items-center justify-content-end pe-1">{ currency.amount }</div>
                    <div className="bg-secondary"><CurrencyIcon type={ currency.type } /></div>
                </div>
            </div>
        </TransitionAnimation>
    );
}
