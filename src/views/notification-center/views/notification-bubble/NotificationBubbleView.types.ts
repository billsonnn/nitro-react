import { NotificationItem } from '../../common/NotificationItem';

export interface NotificationBubbleViewProps
{
    notificationItem: NotificationItem;
    close: () => void;
}
