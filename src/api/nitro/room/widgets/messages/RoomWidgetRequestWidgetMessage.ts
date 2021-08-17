import { RoomWidgetMessage } from './RoomWidgetMessage';

export class RoomWidgetRequestWidgetMessage extends RoomWidgetMessage
{
    public static USER_CHOOSER: string = 'RWRWM_USER_CHOOSER';
    public static FURNI_CHOOSER: string = 'RWRWM_FURNI_CHOOSER';
    public static ME_MENU: string = 'RWRWM_ME_MENU';
    public static EFFECTS: string = 'RWRWM_EFFECTS';
    public static FLOOR_EDITOR: string = 'RWRWM_FLOOR_EDITOR';
}
