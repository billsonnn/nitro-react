import { ICatalogPageParser, RoomPreviewer } from 'nitro-renderer';

export interface CatalogLayoutProps
{
    roomPreviewer: RoomPreviewer;
    pageParser?: ICatalogPageParser;
}
