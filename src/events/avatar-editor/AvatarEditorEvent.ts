import { NitroEvent } from '@nitrots/nitro-renderer';

export class AvatarEditorEvent extends NitroEvent
{
    public static SHOW_EDITOR: string = 'AEE_SHOW_EDITOR';
    public static HIDE_EDITOR: string = 'AEE_HIDE_EDITOR';
    public static TOGGLE_EDITOR: string = 'AEE_TOGGLE_EDITOR';
}
