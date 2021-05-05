import { ICatalogPageParser } from 'nitro-renderer';
import { CatalogLayoutDefaultView } from './default/CatalogLayoutDefaultView';

export function GetCatalogLayout(pageParser: ICatalogPageParser): JSX.Element
{
    switch(pageParser.catalogType)
    {
        case 'frontpage_featured':
            return null;
        case 'frontpage4':
            return null;
        case 'bots':
            return null;
        case 'pets':
            return null;
        case 'pets2':
            return null;
        case 'pets3':
            return null;
        case 'spaces_new':
            return null;
        case 'vip_buy':
            return null;
        case 'guild_frontpage':
            return null;
        case 'guild_custom_furni':
            return null;
        case 'trophies':
            return null;
        case 'search_results':
            return null;
        case 'club_gifts':
            return null;
        case 'marketplace_own_items':
            return null;
        case 'marketplace':
            return null;
        case 'default_3x3':
        default:
            return <CatalogLayoutDefaultView pageParser={ pageParser } />
    }
}
