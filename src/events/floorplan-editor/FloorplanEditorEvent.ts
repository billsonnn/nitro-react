import { NitroEvent } from '@nitrots/nitro-renderer';

export class FloorplanEditorEvent extends NitroEvent
{
    public static SHOW_FLOORPLAN_EDITOR: string = 'FPEE_SHOW_FLOORPLAN_EDITOR';
    public static HIDE_FLOORPLAN_EDITOR: string = 'FPEE_HIDE_FLOORPLAN_EDITOR';
    public static TOGGLE_FLOORPLAN_EDITOR: string = 'FPEE_TOGGLE_FLOORPLAN_EDITOR';
}
