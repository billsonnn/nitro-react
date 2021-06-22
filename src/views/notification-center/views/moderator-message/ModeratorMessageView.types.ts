import { NotificationViewProps } from '../../NotificationCenterView.types';
import { ModeratorMessageNotification } from './../../utils/ModeratorMessageNotification';

export class ModeratorMessageViewProps extends NotificationViewProps
{
    notification: ModeratorMessageNotification;
}
