import { FC, useCallback, useState } from 'react';
import { NotificationCenterAlertEvent } from '../../events';
import { useUiEvent } from '../../hooks/events';
import { NotificationCenterMessageHandler } from './NotificationCenterMessageHandler';
import { NotificationCenterViewProps } from './NotificationCenterView.types';
import { NotificationCenterBroadcastMessageView } from './views/broadcast-message/NotificationCenterBroadcastMessageView';

export const NotificationCenterView: FC<NotificationCenterViewProps> = props =>
{
    const [ alerts, setAlerts ] = useState<NotificationCenterAlertEvent[]>([]);

    const onNotificationCenterAlertEvent = useCallback((event: NotificationCenterAlertEvent) =>
    {
        setAlerts(prevValue =>
            {
                return [ ...prevValue, event ];
            });
    }, []);

    useUiEvent(NotificationCenterAlertEvent.HOTEL_ALERT, onNotificationCenterAlertEvent);

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

    return (
        <>
            <NotificationCenterMessageHandler />
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
