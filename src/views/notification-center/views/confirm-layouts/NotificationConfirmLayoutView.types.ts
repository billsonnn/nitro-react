import { NotificationConfirmItem } from '../../common/NotificationConfirmItem';

export interface NotificationConfirmLayoutViewProps
{
    item: NotificationConfirmItem;
    close: () => void;
}
