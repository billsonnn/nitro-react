import { NotificationBubbleItem } from '../../../../api';

export interface NotificationBubbleLayoutViewProps
{
    item: NotificationBubbleItem;
    close: () => void;
}
