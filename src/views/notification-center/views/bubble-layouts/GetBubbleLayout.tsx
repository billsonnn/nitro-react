import { NotificationItem } from '../../common/NotificationItem';
import { NotificationType } from '../../common/NotificationType';
import { NotificationClubGiftBubbleView } from './club-gift/NotificationClubGiftBubbleView';
import { NotificationDefaultBubbleView } from './default/NotificationDefaultBubbleView';

export const GetBubbleLayout = (item: NotificationItem, close: () => void) =>
{
    if(!item) return null;

    const props = { key: item.id, item, close };

    switch(item.notificationType)
    {
        case NotificationType.CLUBGIFT:
            return <NotificationClubGiftBubbleView { ...props } />
        default:
            return <NotificationDefaultBubbleView { ...props } />
    }
}
