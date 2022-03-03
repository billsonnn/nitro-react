import { NotificationAlertItem } from '../../common/NotificationAlertItem';
import { NotificationAlertType } from '../../common/NotificationAlertType';
import { NotificationDefaultAlertView } from './NotificationDefaultAlertView';
import { NotificationEventAlertView } from './NotificationEventAlertView';

export const GetAlertLayout = (item: NotificationAlertItem, close: () => void) =>
{
    if(!item) return null;

    const props = { key: item.id, item, close };

    switch(item.alertType)
    {
        case NotificationAlertType.EVENT:
            return <NotificationEventAlertView { ...props } />
        default:
            return <NotificationDefaultAlertView { ...props } />
    }
}
