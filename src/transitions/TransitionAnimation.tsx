import { Transition } from 'react-transition-group';
import { TransitionAnimationProps } from './TransitionAnimation.types';
import { getTransitionAnimationStyle } from './TransitionAnimationStyles';

export function TransitionAnimation(props: TransitionAnimationProps): JSX.Element
{
    const { type = null, inProp = false, timeout = 300, className = null, children = null } = props;

    return (
        <Transition in={ inProp } timeout={ timeout }>
            {state => (
                <div className={ className + " animate__animated" } style={ { ...getTransitionAnimationStyle(type, state, timeout) } }>
                    { children }
                </div>
            )}
        </Transition>
    );
}
