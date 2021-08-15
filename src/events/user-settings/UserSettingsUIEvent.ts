import { NitroEvent } from '@nitrots/nitro-renderer';

export class UserSettingsUIEvent extends NitroEvent
{
    public static SHOW_USER_SETTINGS: string = 'NE_SHOW_USER_SETTINGS';
    public static HIDE_USER_SETTINGS: string = 'NE_HIDE_USER_SETTINGS';
    public static TOGGLE_USER_SETTINGS: string = 'NE_TOGGLE_USER_SETTINGS';
}
