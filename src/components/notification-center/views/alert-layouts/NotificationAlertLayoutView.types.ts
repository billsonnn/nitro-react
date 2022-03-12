import { NotificationAlertItem } from '../../../../api';

export interface NotificationAlertLayoutViewProps
{
    item: NotificationAlertItem;
    close: () => void;
}
