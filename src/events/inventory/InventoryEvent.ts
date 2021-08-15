import { NitroEvent } from '@nitrots/nitro-renderer';

export class InventoryEvent extends NitroEvent
{
    public static SHOW_INVENTORY: string = 'IE_SHOW_INVENTORY';
    public static HIDE_INVENTORY: string = 'IE_HIDE_INVENTORY';
    public static TOGGLE_INVENTORY: string = 'IE_TOGGLE_INVENTORY';
}
