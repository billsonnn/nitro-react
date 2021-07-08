import { NotificationCenterAlertEvent } from '../../../../events';

export class NotificationCenterBroadcastMessageViewProps
{
    notification: NotificationCenterAlertEvent;
    onClose: () => void;
}
