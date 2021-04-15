import { Transition } from 'react-transition-group';
import { FadeTransitionProps } from './FadeTransition.types';
import { getTransitionStyle, transitionTypes } from './TransitionStyles';

export function FadeTransition(props: FadeTransitionProps): JSX.Element
{
    const { inProp = false, timeout = 300 } = props;

    const style = getTransitionStyle('ease-in-out', timeout);

    return (
        <Transition in={ inProp } timeout={ timeout }>
            {state => (
                <div style={{
                    ...style,
                    ...transitionTypes[state]
                }}>
                    { props.children }
                </div>
            )}
        </Transition>
    );
}
