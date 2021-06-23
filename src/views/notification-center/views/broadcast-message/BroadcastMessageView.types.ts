import { NotificationViewProps } from '../../NotificationCenterView.types';
import { BroadcastMessageNotification } from './../../utils/BroadcastMessageNotification';

export class BroadcastMessageViewProps extends NotificationViewProps
{
    notification: BroadcastMessageNotification;
}
