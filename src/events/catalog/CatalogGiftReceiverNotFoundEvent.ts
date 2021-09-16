import { CatalogEvent } from './CatalogEvent';

export class CatalogGiftReceiverNotFoundEvent extends CatalogEvent
{
    constructor()
    {
        super(CatalogEvent.GIFT_RECEIVER_NOT_FOUND);
    }
}
