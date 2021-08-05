import { HotelWillShutdownNotification } from '../../common/HotelWillShutdownNotification';
import { NotificationViewProps } from '../../NotificationCenterView.types';

export class HotelWillShutdownViewProps extends NotificationViewProps
{
    notification: HotelWillShutdownNotification;
}
