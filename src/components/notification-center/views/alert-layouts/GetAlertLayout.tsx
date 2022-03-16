import { NotificationAlertItem } from '../../../../api';
import { NotificationDefaultAlertView } from './NotificationDefaultAlertView';

export const GetAlertLayout = (item: NotificationAlertItem, close: () => void) =>
{
    if(!item) return null;

    const props = { key: item.id, item, close };

    return <NotificationDefaultAlertView { ...props } />
}
