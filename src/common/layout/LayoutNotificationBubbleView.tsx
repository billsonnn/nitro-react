import { FC, useEffect, useMemo, useState } from 'react';
import { Flex, FlexProps } from '../Flex';
import { TransitionAnimation, TransitionAnimationTypes } from '../transitions';

export interface LayoutNotificationBubbleViewProps extends FlexProps
{
    fadesOut?: boolean;
    timeoutMs?: number;
    onClose: () => void;
}

export const LayoutNotificationBubbleView: FC<LayoutNotificationBubbleViewProps> = props =>
{
    const { fadesOut = true, timeoutMs = 8000, onClose = null, overflow = 'hidden', classNames = [], ...rest } = props;
    const [ isVisible, setIsVisible ] = useState(false);

    const getClassNames = useMemo(() =>
    {
        const newClassNames: string[] = [ 'text-sm bg-[#1c1c20f2] px-[5px] py-[6px] [box-shadow:inset_0_5px_#22222799,_inset_0_-4px_#12121599] ', 'rounded' ];

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

            setTimeout(() => onClose(), 300);
        }, timeoutMs);

        return () => clearTimeout(timeout);
    }, [ fadesOut, timeoutMs, onClose ]);

    return (
        <TransitionAnimation inProp={ isVisible } timeout={ 300 } type={ TransitionAnimationTypes.FADE_IN }>
            <Flex classNames={ getClassNames } overflow={ overflow } onClick={ onClose } { ...rest } />
        </TransitionAnimation>
    );
};
