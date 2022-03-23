import { NotificationAlertItem, NotificationAlertType } from '../../../../api';
import { NitroSystemAlertView } from './NitroSystemAlertView';
import { NotificationDefaultAlertView } from './NotificationDefaultAlertView';

export const GetAlertLayout = (item: NotificationAlertItem, close: () => void) =>
{
    if(!item) return null;

    const props = { key: item.id, item, close };

    switch(item.alertType)
    {
        case NotificationAlertType.NITRO:
            return <NitroSystemAlertView { ...props } />
        default:
            return <NotificationDefaultAlertView { ...props } />
    }
}
