import { NotificationConfirmItem } from '../../../../api';
import { NotificationDefaultConfirmView } from './NotificationDefaultConfirmView';

export const GetConfirmLayout = (item: NotificationConfirmItem, onClose: () => void) =>
{
    if(!item) return null;

    const props = { key: item.id, item, onClose };

    switch(item.confirmType)
    {
        default:
            return <NotificationDefaultConfirmView { ...props } />;
    }
};
