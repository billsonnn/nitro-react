import { FC, ReactNode, useMemo } from 'react';
import { NotificationBubbleType } from '../../api';
import { useNotification } from '../../hooks';
import { GetAlertLayout } from './views/alert-layouts/GetAlertLayout';
import { GetBubbleLayout } from './views/bubble-layouts/GetBubbleLayout';
import { GetConfirmLayout } from './views/confirm-layouts/GetConfirmLayout';

export const NotificationCenterView: FC<{}> = props =>
{
    const { alerts = [], bubbleAlerts = [], confirms = [], closeAlert = null, closeBubbleAlert = null, closeConfirm = null } = useNotification();

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
            <div className="flex flex-col gap-1">
                { getBubbleAlerts }
            </div>
            { getConfirms }
            { getAlerts }
        </>
    );
};
