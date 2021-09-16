import { FC, useEffect, useState } from 'react';
import { NotificationBubbleViewProps } from './NotificationBubbleView.types';

export const NotificationBubbleView: FC<NotificationBubbleViewProps> = props =>
{
    const { fadesOut = false, close = null, className = '', children = null, ...rest } = props;
    const [ isFading, setIsFading ] = useState(false);

    useEffect(() =>
    {
        if(!fadesOut) return;

        const timeout = setTimeout(() =>
        {
            setIsFading(true);

            setTimeout(() => close());
        }, 8000);

        return () => clearTimeout(timeout);
    }, [ fadesOut, close ]);

    return (
        <div className={ ('nitro-notification-bubble rounded ' + (className || '')) } { ...rest } onClick={ close }>
            { children }
        </div>
    )
}
