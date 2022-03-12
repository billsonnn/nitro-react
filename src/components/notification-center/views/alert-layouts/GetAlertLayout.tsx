import { NotificationAlertItem, NotificationAlertType } from '../../../../api';
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
