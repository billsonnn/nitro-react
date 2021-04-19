import { NitroEvent } from 'nitro-renderer';

export class NavigatorEvent extends NitroEvent
{
    public static SHOW_NAVIGATOR: string = 'NE_SHOW_NAVIGATOR';
    public static TOGGLE_NAVIGATOR: string = 'NE_TOGGLE_NAVIGATOR';
}
