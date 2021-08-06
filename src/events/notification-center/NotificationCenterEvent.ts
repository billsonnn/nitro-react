import { NitroEvent } from '@nitrots/nitro-renderer';

export class NotificationCenterEvent extends NitroEvent
{
    public static SHOW_NOTIFICATION_CENTER: string = 'NCE_SHOW_NOTIFICATION_CENTER';
    public static HIDE_NOTIFICATION_CENTER: string = 'NCE_HIDE_NOTIFICATION_CENTER';
    public static TOGGLE_NOTIFICATION_CENTER: string = 'NCE_TOGGLE_NOTIFICATION_CENTER';
    public static ADD_NOTIFICATION: string = 'NCE_ADD_NOTIFICATION';
}
