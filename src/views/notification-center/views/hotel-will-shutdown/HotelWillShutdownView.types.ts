import { NotificationViewProps } from '../../NotificationCenterView.types';
import { HotelWillShutdownNotification } from './../../utils/HotelWillShutdownNotification';

export class HotelWillShutdownViewProps extends NotificationViewProps
{
    notification: HotelWillShutdownNotification;
}
