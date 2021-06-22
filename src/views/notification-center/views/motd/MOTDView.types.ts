import { NotificationViewProps } from '../../NotificationCenterView.types';
import { MOTDNotification } from './../../utils/MOTDNotification';

export class MOTDViewProps extends NotificationViewProps
{
    notification: MOTDNotification;
}
