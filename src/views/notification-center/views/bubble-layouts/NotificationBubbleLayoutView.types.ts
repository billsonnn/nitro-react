import { NotificationItem } from '../../common/NotificationItem';

export interface NotificationBubbleLayoutViewProps
{
    item: NotificationItem;
    close: () => void;
}
