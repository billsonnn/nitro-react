import { useEffect, useState } from 'react';
import { TransitionAnimation } from '../../../transitions/TransitionAnimation';
import { TransitionAnimationTypes } from '../../../transitions/TransitionAnimation.types';
import { CurrencyIcon } from '../../../utils/currency-icon/CurrencyIcon';
import { CurrencyViewProps } from './CurrencyView.types';

export function CurrencyView(props: CurrencyViewProps): JSX.Element
{
    const { currencySet = null } = props;
    const [ isAnimating, setIsAnimating ] = useState(false);

    useEffect(() =>
    {
        setIsAnimating(true);

        const timeout = setTimeout(() => setIsAnimating(false), 1000);

        return () => clearTimeout(timeout);
    }, []);

    return (
        <TransitionAnimation className="d-flex bg-primary rounded shadow border border-black mb-1 p-1 nitro-currency" type={ TransitionAnimationTypes.HEAD_SHAKE } inProp={ isAnimating } timeout={ 300 }>
            <div className="d-flex flex-grow-1 align-items-center justify-content-end">{ currencySet.amount }</div>
            <div className="bg-secondary rounded ml-1"><CurrencyIcon type={ currencySet.type } /></div>
        </TransitionAnimation>
    );
}
