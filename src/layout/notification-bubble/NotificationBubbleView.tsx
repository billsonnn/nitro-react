import { FC, useEffect, useMemo, useState } from 'react';
import { NitroLayoutBase } from '../base';
import { TransitionAnimation, TransitionAnimationTypes } from '../transitions';
import { NotificationBubbleViewProps } from './NotificationBubbleView.types';

export const NotificationBubbleView: FC<NotificationBubbleViewProps> = props =>
{
    const { fadesOut = true, timeoutMs = 8000, close = null, className = '', ...rest } = props;
    const [ isVisible, setIsVisible ] = useState(false);

    const getClassName = useMemo(() =>
    {
        let newClassName = 'nitro-notification-bubble rounded';

        if(className && className.length) newClassName += ` ${ className }`;

        return newClassName;
    }, [ className ]);

    useEffect(() =>
    {
        setIsVisible(true);

        return () => setIsVisible(false);
    }, []);

    useEffect(() =>
    {
        if(!fadesOut) return;

        const timeout = setTimeout(() =>
            {
                setIsVisible(false);

                setTimeout(() => close(), 300);
            }, timeoutMs);

        return () => clearTimeout(timeout);
    }, [ fadesOut, timeoutMs, close ]);

    return (
        <TransitionAnimation type={ TransitionAnimationTypes.FADE_IN } inProp={ isVisible } timeout={ 300 }>
            <NitroLayoutBase className={ getClassName } onClick={ close } { ...rest } />
        </TransitionAnimation>
    );
}
