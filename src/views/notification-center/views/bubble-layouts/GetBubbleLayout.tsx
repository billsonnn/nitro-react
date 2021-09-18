import { NotificationBubbleItem } from '../../common/NotificationBubbleItem';
import { NotificationBubbleType } from '../../common/NotificationBubbleType';
import { NotificationClubGiftBubbleView } from './club-gift/NotificationClubGiftBubbleView';
import { NotificationDefaultBubbleView } from './default/NotificationDefaultBubbleView';

export const GetBubbleLayout = (item: NotificationBubbleItem, close: () => void) =>
{
    if(!item) return null;

    const props = { key: item.id, item, close };

    switch(item.notificationType)
    {
        case NotificationBubbleType.CLUBGIFT:
            return <NotificationClubGiftBubbleView { ...props } />
        default:
            return <NotificationDefaultBubbleView { ...props } />
    }
}
