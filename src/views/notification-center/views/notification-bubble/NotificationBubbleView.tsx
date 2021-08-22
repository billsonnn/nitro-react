import { FC, useMemo } from 'react';
import { LocalizeText } from '../../../../api';
import { NotificationBubbleViewProps } from './NotificationBubbleView.types';

export const NotificationBubbleView: FC<NotificationBubbleViewProps> = props =>
{
    const { notificationItem = null, close = null } = props;

    const message = useMemo(() =>
    {
        return LocalizeText(notificationItem.message);
    }, [ notificationItem ]);
    
    return (
        <div className="notification-bubble">
            { message }
        </div>
    );
}
