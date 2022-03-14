import { FC, useEffect, useMemo, useState } from 'react';
import { Flex, FlexProps } from '..';
import { TransitionAnimation, TransitionAnimationTypes } from '../transitions';

export interface LayoutNotificationBubbleViewProps extends FlexProps
{
    fadesOut?: boolean;
    timeoutMs?: number;
    close: () => void;
}

export const LayoutNotificationBubbleView: FC<LayoutNotificationBubbleViewProps> = props =>
{
    const { fadesOut = true, timeoutMs = 8000, close = null, overflow = 'hidden', classNames = [], ...rest } = props;
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
            <Flex overflow={ overflow } classNames={ getClassNames } onClick={ close } { ...rest } />
        </TransitionAnimation>
    );
}
