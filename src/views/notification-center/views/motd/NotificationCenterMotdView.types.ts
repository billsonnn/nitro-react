import { NotificationCenterAlertEvent } from '../../../../events';

export interface NotificationCenterMotdViewProps
{
    notification: NotificationCenterAlertEvent;
    onClose: () => void;
}
