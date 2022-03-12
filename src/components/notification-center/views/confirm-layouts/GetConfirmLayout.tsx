import { NotificationConfirmItem } from '../../../../api';
import { NotificationDefaultConfirmView } from './NotificationDefaultConfirmView';

export const GetConfirmLayout = (item: NotificationConfirmItem, close: () => void) =>
{
    if(!item) return null;

    const props = { key: item.id, item, close };

    switch(item.confirmType)
    {
        default:
            return <NotificationDefaultConfirmView { ...props } />
    }
}
