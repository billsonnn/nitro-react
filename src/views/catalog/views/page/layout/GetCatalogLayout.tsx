import { ICatalogPageParser, RoomPreviewer } from 'nitro-renderer';
import { CatalogLayoutDefaultView } from './default/CatalogLayoutDefaultView';
import { CatalogLayoutSpacesView } from './spaces-new/CatalogLayoutSpacesView';
import { CatalogLayoutTrophiesView } from './trophies/CatalogLayoutTrophiesView';

export function GetCatalogLayout(pageParser: ICatalogPageParser, roomPreviewer: RoomPreviewer): JSX.Element
{
    switch(pageParser.layoutCode)
    {
        case 'frontpage_featured':
            return null;
        case 'frontpage4':
            return null;
        case 'pets':
            return null;
        case 'pets2':
            return null;
        case 'pets3':
            return null;
        case 'vip_buy':
            return null;
        case 'guild_frontpage':
            return null;
        case 'guild_custom_furni':
            return null;
        case 'search_results':
            return null;
        case 'club_gifts':
            return null;
        case 'marketplace_own_items':
            return null;
        case 'marketplace':
            return null;
        case 'spaces_new':
            return <CatalogLayoutSpacesView roomPreviewer={ roomPreviewer } pageParser={ pageParser } />;
        case 'trophies':
            return <CatalogLayoutTrophiesView roomPreviewer={ roomPreviewer } pageParser={ pageParser } />;
        case 'bots':
        case 'default_3x3':
        default:
            return <CatalogLayoutDefaultView roomPreviewer={ roomPreviewer } pageParser={ pageParser } />;
    }
}
