import { NitroEvent } from '@nitrots/nitro-renderer';

export class CatalogPageReadyEvent extends NitroEvent
{
    public static PAGE_READY: string = 'CPRE_PAGE_READY';

    constructor()
    {
        super(CatalogPageReadyEvent.PAGE_READY);
    }
}
