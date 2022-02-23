import { NitroEvent } from '@nitrots/nitro-renderer';

export class GuideToolEvent extends NitroEvent
{
    public static readonly SHOW_GUIDE_TOOL: string = 'GTE_SHOW_GUIDE_TOOL';
    public static readonly HIDE_GUIDE_TOOL: string = 'GTE_HIDE_GUIDE_TOOL';
    public static readonly TOGGLE_GUIDE_TOOL: string = 'GTE_TOGGLE_GUIDE_TOOL';
    public static readonly CREATE_HELP_REQUEST: string = 'GTE_CREATE_HELP_REQUEST';
    public static readonly CREATE_BULLY_REQUEST: string = 'GTE_CREATE_BULLY_REQUEST';
}
