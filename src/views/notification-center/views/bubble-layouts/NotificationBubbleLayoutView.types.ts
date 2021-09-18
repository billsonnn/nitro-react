import { NotificationBubbleItem } from '../../common/NotificationBubbleItem';

export interface NotificationBubbleLayoutViewProps
{
    item: NotificationBubbleItem;
    close: () => void;
}
