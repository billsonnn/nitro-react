import { ModeratorMessageNotification } from '../../common/ModeratorMessageNotification';
import { NotificationViewProps } from '../../NotificationCenterView.types';

export class ModeratorMessageViewProps extends NotificationViewProps
{
    notification: ModeratorMessageNotification;
}
