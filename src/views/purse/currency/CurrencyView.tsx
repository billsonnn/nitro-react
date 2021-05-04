import { useEffect, useState } from 'react';
import { TransitionAnimation } from '../../../transitions/TransitionAnimation';
import { TransitionAnimationTypes } from '../../../transitions/TransitionAnimation.types';
import { CurrencyIcon } from '../../../utils/currency-icon/CurrencyIcon';
import { CurrencyViewProps } from './CurrencyView.types';

export function CurrencyView(props: CurrencyViewProps): JSX.Element
{
    const { currencySet = null } = props;

    const [ firstRender, setFirstRender ] = useState(true);
    const [ isAnimating, setIsAnimating ] = useState(false);

    useEffect(() =>
    {
        if(firstRender)
        {
            setFirstRender(false);

            return;
        }

        setIsAnimating(true);

        let timeout = setTimeout(() =>
        {
            setIsAnimating(false)
            
            timeout = null
        }, 300);

        return () => clearTimeout(timeout);
    }, [ firstRender, currencySet ]);

    return (
        <TransitionAnimation type={ TransitionAnimationTypes.FADE_IN } inProp={ isAnimating } timeout={ 300 }>
            <div className="col pe-1 pb-1">
                <div className="d-flex bg-primary rounded border overflow-hidden">
                    <div className="d-flex flex-grow-1 align-items-center justify-content-end pe-1">{ currencySet.amount }</div>
                    <div className="bg-secondary"><CurrencyIcon type={ currencySet.type } /></div>
                </div>
            </div>
        </TransitionAnimation>
    );
}
