import { NitroEvent } from '@nitrots/nitro-renderer';

export class AchievementsUIEvent extends NitroEvent
{
    public static SHOW_ACHIEVEMENTS: string = 'AE_SHOW_ACHIEVEMENTS';
    public static HIDE_ACHIEVEMENTS: string = 'AE_HIDE_ACHIEVEMENTS';
    public static TOGGLE_ACHIEVEMENTS: string = 'AE_TOGGLE_ACHIEVEMENTS';
}
