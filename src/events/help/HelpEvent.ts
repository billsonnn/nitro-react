import { NitroEvent } from '@nitrots/nitro-renderer';

export class HelpEvent extends NitroEvent
{
    public static SHOW_HELP_CENTER: string = 'HCE_SHOW_HELP_CENTER';
    public static HIDE_HELP_CENTER: string = 'HCE_HIDE_HELP_CENTER';
    public static TOGGLE_HELP_CENTER: string = 'HCE_TOGGLE_HELP_CENTER';
}
