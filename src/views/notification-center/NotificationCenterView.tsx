import { FC, ReactNode, useCallback, useMemo, useState } from 'react';
import { NotificationAlertEvent, NotificationConfirmEvent } from '../../events';
import { NotificationBubbleEvent } from '../../events/notification-center/NotificationBubbleEvent';
import { useUiEvent } from '../../hooks/events';
import { NotificationAlertItem } from './common/NotificationAlertItem';
import { NotificationBubbleItem } from './common/NotificationBubbleItem';
import { NotificationBubbleType } from './common/NotificationBubbleType';
import { NotificationConfirmItem } from './common/NotificationConfirmItem';
import { NotificationCenterMessageHandler } from './NotificationCenterMessageHandler';
import { NotificationCenterViewProps } from './NotificationCenterView.types';
import { GetAlertLayout } from './views/alert-layouts/GetAlertLayout';
import { GetBubbleLayout } from './views/bubble-layouts/GetBubbleLayout';
import { GetConfirmLayout } from './views/confirm-layouts/GetConfirmLayout';

export const NotificationCenterView: FC<NotificationCenterViewProps> = props =>
{
    const [ alerts, setAlerts ] = useState<NotificationAlertItem[]>([]);
    const [ bubbleAlerts, setBubbleAlerts ] = useState<NotificationBubbleItem[]>([]);
    const [ confirms, setConfirms ] = useState<NotificationConfirmItem[]>([]);

    const onNotificationAlertEvent = useCallback((event: NotificationAlertEvent) =>
    {
        const alertItem = new NotificationAlertItem(event.messages, event.alertType, event.clickUrl, event.clickUrlText, event.title, event.imageUrl);

        setAlerts(prevValue => [ alertItem, ...prevValue ]);
    }, []);

    useUiEvent(NotificationAlertEvent.ALERT, onNotificationAlertEvent);

    const onNotificationBubbleEvent = useCallback((event: NotificationBubbleEvent) =>
    {
        const notificationItem = new NotificationBubbleItem(event.message, event.notificationType, event.imageUrl, event.linkUrl);

        setBubbleAlerts(prevValue => [ notificationItem, ...prevValue ]);
    }, []);

    useUiEvent(NotificationBubbleEvent.NEW_BUBBLE, onNotificationBubbleEvent);

    const onNotificationConfirmEvent = useCallback((event: NotificationConfirmEvent) =>
    {
        const confirmItem = new NotificationConfirmItem(event.type, event.message, event.onConfirm, event.onCancel, event.confirmText, event.cancelText, event.title);

        setConfirms(prevValue => [ confirmItem, ...prevValue ]);
    }, []);

    useUiEvent(NotificationConfirmEvent.CONFIRM, onNotificationConfirmEvent);

    const closeAlert = useCallback((alert: NotificationAlertItem) =>
    {
        setAlerts(prevValue =>
            {
                const newAlerts = [ ...prevValue ];
                const index = newAlerts.findIndex(value => (alert === value));

                if(index >= 0) newAlerts.splice(index, 1);

                return newAlerts;
            });
    }, []);

    const closeBubbleAlert = useCallback((item: NotificationBubbleItem) =>
    {
        setBubbleAlerts(prevValue =>
            {
                const newAlerts = [ ...prevValue ];
                const index = newAlerts.findIndex(value => (item === value));

                if(index >= 0) newAlerts.splice(index, 1);

                return newAlerts;
            })
    }, []);

    const closeConfirm = useCallback((item: NotificationConfirmItem) =>
    {
        setConfirms(prevValue =>
            {
                const newConfirms = [ ...prevValue ];
                const index = newConfirms.findIndex(value => (item === value));

                if(index >= 0) newConfirms.splice(index, 1);

                return newConfirms;
            })
    }, []);

    const getAlerts = useMemo(() =>
    {
        if(!alerts || !alerts.length) return null;

        const elements: ReactNode[] = [];

        for(const alert of alerts)
        {
            const element = GetAlertLayout(alert, () => closeAlert(alert));

            elements.push(element);
        }

        return elements;
    }, [ alerts, closeAlert ]);

    const getBubbleAlerts = useMemo(() =>
    {
        if(!bubbleAlerts || !bubbleAlerts.length) return null;

        const elements: ReactNode[] = [];

        for(const alert of bubbleAlerts)
        {
            const element = GetBubbleLayout(alert, () => closeBubbleAlert(alert));

            if(alert.notificationType === NotificationBubbleType.CLUBGIFT)
            {
                elements.unshift(element);

                continue;
            }

            elements.push(element);
        }

        return elements;
    }, [ bubbleAlerts, closeBubbleAlert ]);

    const getConfirms = useMemo(() =>
    {
        if(!confirms || !confirms.length) return null;

        const elements: ReactNode[] = [];

        for(const confirm of confirms)
        {
            const element = GetConfirmLayout(confirm, () => closeConfirm(confirm));

            elements.push(element);
        }

        return elements;
    }, [ confirms, closeConfirm ]);

    return (
        <>
            <NotificationCenterMessageHandler />
            <div className="nitro-notification-center">
                { getBubbleAlerts }
            </div>
            { getConfirms }
            { getAlerts }
        </>
    );
}
