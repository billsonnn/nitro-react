import { useEffect, useState } from 'react';
import { Transition } from 'react-transition-group';
import { TransitionAnimationProps } from './TransitionAnimation.types';
import { getTransitionAnimationStyle } from './TransitionAnimationStyles';

export function TransitionAnimation(props: TransitionAnimationProps): JSX.Element
{
    const { type = null, inProp = false, timeout = 300, className = null, children = null } = props;

    const [ showChild, setShowChild ] = useState(false);
    const [ timeoutInstance, setTimeoutInstance ] = useState<any>(null);

    useEffect(() =>
    {
        if(inProp)
        {
            clearTimeout(timeoutInstance);
            setShowChild(true);
        }
        else
        {
            setTimeoutInstance(setTimeout(() => {
                setShowChild(false);
                clearTimeout(timeoutInstance);
            }, timeout));
        }
    }, [ inProp ])

    return (
        <Transition in={ inProp } timeout={ timeout }>
            {state => (
                <div className={ className + " animate__animated" } style={ { ...getTransitionAnimationStyle(type, state, timeout) } }>
                    { showChild && children }
                </div>
            )}
        </Transition>
    );
}
