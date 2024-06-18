import { NotificationBubbleItem, NotificationBubbleType } from '../../../../api';
import { NotificationClubGiftBubbleView } from './NotificationClubGiftBubbleView';
import { NotificationDefaultBubbleView } from './NotificationDefaultBubbleView';

export const GetBubbleLayout = (item: NotificationBubbleItem, onClose: () => void) =>
{
    if(!item) return null;

    const props = { item, onClose };

    switch(item.notificationType)
    {
        case NotificationBubbleType.CLUBGIFT:
            return <NotificationClubGiftBubbleView key={ item.id } { ...props } />;
        default:
            return <NotificationDefaultBubbleView key={ item.id } { ...props } />;
    }
};
