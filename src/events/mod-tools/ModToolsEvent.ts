import { NitroEvent } from '@nitrots/nitro-renderer';

export class ModToolsEvent extends NitroEvent
{
    public static SHOW_MOD_TOOLS: string = 'MTE_SHOW_MOD_TOOLS';
    public static HIDE_MOD_TOOLS: string = 'MTE_HIDE_MOD_TOOLS';
    public static TOGGLE_MOD_TOOLS: string = 'MTE_TOGGLE_MOD_TOOLS';
    public static OPEN_ROOM_INFO: string = 'MTE_OPEN_ROOM_INFO';
    public static OPEN_ROOM_CHATLOG: string = 'MTE_OPEN_ROOM_CHATLOG';
    public static OPEN_USER_INFO: string = 'MTE_OPEN_USER_INFO';
    public static OPEN_USER_CHATLOG: string = 'MTE_OPEN_USER_CHATLOG';
}
