import { ICatalogPageParser, RoomPreviewer } from '@nitrots/nitro-renderer';

export interface CatalogLayoutProps
{
    roomPreviewer: RoomPreviewer;
    pageParser?: ICatalogPageParser;
}
