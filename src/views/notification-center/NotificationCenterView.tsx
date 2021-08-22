import { FC, ReactNode, useCallback, useMemo, useState } from 'react';
import { NotificationCenterAlertEvent } from '../../events';
import { NotificationBubbleEvent } from '../../events/notification-center/NotificationBubbleEvent';
import { useUiEvent } from '../../hooks/events';
import { NotificationItem } from './common/NotificationItem';
import { NotificationCenterMessageHandler } from './NotificationCenterMessageHandler';
import { NotificationCenterViewProps } from './NotificationCenterView.types';
import { NotificationCenterBroadcastMessageView } from './views/broadcast-message/NotificationCenterBroadcastMessageView';
import { NotificationBubbleView } from './views/notification-bubble/NotificationBubbleView';

export const NotificationCenterView: FC<NotificationCenterViewProps> = props =>
{
    const [ alerts, setAlerts ] = useState<NotificationCenterAlertEvent[]>([]);
    const [ bubbleAlerts, setBubbleAlerts ] = useState<NotificationItem[]>([]);

    const onNotificationCenterAlertEvent = useCallback((event: NotificationCenterAlertEvent) =>
    {
        setAlerts(prevValue =>
            {
                return [ ...prevValue, event ];
            });
    }, []);

    useUiEvent(NotificationCenterAlertEvent.HOTEL_ALERT, onNotificationCenterAlertEvent);

    const onNotificationBubbleEvent = useCallback((event: NotificationBubbleEvent) =>
    {
        console.log(event);
        const notificationItem = new NotificationItem(event.message, event.notificationType, null, event.linkUrl);

        setBubbleAlerts(prevValue => [ notificationItem, ...prevValue ]);
    }, []);

    useUiEvent(NotificationBubbleEvent.NEW_BUBBLE, onNotificationBubbleEvent);

    const closeAlert = useCallback((alert: NotificationCenterAlertEvent) =>
    {
        setAlerts(prevValue =>
            {
                const newAlerts = [ ...prevValue ];
                const index = newAlerts.findIndex(value => (alert === value));

                if(index >= 0) newAlerts.splice(index, 1);

                return newAlerts;
            });
    }, []);

    const closeBubbleAlert = useCallback((item: NotificationItem) =>
    {
        setBubbleAlerts(prevValue =>
            {
                const newAlerts = [ ...prevValue ];
                const index = newAlerts.findIndex(value => (item === value));

                if(index >= 0) newAlerts.splice(index, 1);

                return newAlerts;
            })
    }, []);

    const getBubbleAlerts = useMemo(() =>
    {
        if(!bubbleAlerts || !bubbleAlerts.length) return null;

        const elements: ReactNode[] = [];

        for(const alert of bubbleAlerts) elements.push(<NotificationBubbleView key={ alert.id } notificationItem={ alert } close={ () => closeBubbleAlert(alert) } />);

        return elements;
    }, [ bubbleAlerts, closeBubbleAlert ]);

    return (
        <>
            <NotificationCenterMessageHandler />
            <div className="nitro-notification-center">
                { getBubbleAlerts }
            </div>
            { (alerts.length > 0) && alerts.map((alert, index) =>
                {
                    switch(alert.type)
                    {
                        case NotificationCenterAlertEvent.HOTEL_ALERT:
                        default:
                            return <NotificationCenterBroadcastMessageView key={ index } notification={ alert } onClose={ () => closeAlert(alert) } />;
                    }
                })}
        </>
    );
}
