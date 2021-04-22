import { NitroEvent } from 'nitro-renderer';

export class CatalogEvent extends NitroEvent
{
    public static SHOW_CATALOG: string = 'IE_SHOW_CATALOG';
    public static TOGGLE_CATALOG: string = 'IE_TOGGLE_CATALOG';
}
