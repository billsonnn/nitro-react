import { FC, useEffect, useMemo, useState } from 'react';
import { Base, BaseProps } from '../../common';
import { TransitionAnimation, TransitionAnimationTypes } from '../transitions';

interface NotificationBubbleViewProps extends BaseProps<HTMLDivElement>
{
    fadesOut?: boolean;
    timeoutMs?: number;
    close: () => void;
}

export const NotificationBubbleView: FC<NotificationBubbleViewProps> = props =>
{
    const { fadesOut = true, timeoutMs = 8000, close = null, classNames = [], ...rest } = props;
    const [ isVisible, setIsVisible ] = useState(false);

    const getClassNames = useMemo(() =>
    {
        const newClassNames: string[] = [ 'nitro-notification-bubble', 'rounded' ];

        if(classNames.length) newClassNames.push(...classNames);

        return newClassNames;
    }, [ classNames ]);

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
            <Base classNames={ getClassNames } onClick={ close } { ...rest } />
        </TransitionAnimation>
    );
}
