import { NotificationConfirmItem } from '../../../../api';

export interface NotificationConfirmLayoutViewProps
{
    item: NotificationConfirmItem;
    close: () => void;
}
