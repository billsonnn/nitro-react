import { NitroNotification } from '../../views/notification-center/utils/Notification';
import { NotificationCenterEvent } from './NotificationCenterEvent';

export class NotificationCenterAddNotificationEvent extends NotificationCenterEvent
{
    private _notification: NitroNotification;

    constructor(notification: NitroNotification)
    {
        super(NotificationCenterEvent.ADD_NOTIFICATION);
        
        this._notification = notification;
    }

    public get notification(): NitroNotification
    {
        return this._notification;
    }
}
