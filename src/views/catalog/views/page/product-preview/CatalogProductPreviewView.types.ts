import { CatalogPageMessageOfferData, CatalogPageMessageParser, RoomPreviewer } from '@nitrots/nitro-renderer';

export interface CatalogProductPreviewViewProps
{
    pageParser: CatalogPageMessageParser;
    activeOffer: CatalogPageMessageOfferData;
    roomPreviewer: RoomPreviewer;
    extra?: string;
    disabled?: boolean;
}
