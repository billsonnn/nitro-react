import { NotificationAlertItem } from '../../common/NotificationAlertItem';

export interface NotificationAlertLayoutViewProps
{
    item: NotificationAlertItem;
    close: () => void;
}
