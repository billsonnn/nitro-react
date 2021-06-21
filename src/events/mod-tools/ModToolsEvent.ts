import { NitroEvent } from 'nitro-renderer';

export class ModToolsEvent extends NitroEvent
{
    public static SHOW_MOD_TOOLS: string = 'MTE_SHOW_MOD_TOOLS';
    public static HIDE_MOD_TOOLS: string = 'MTE_HIDE_MOD_TOOLS';
    public static TOGGLE_MOD_TOOLS: string = 'MTE_TOGGLE_MOD_TOOLS';
}
