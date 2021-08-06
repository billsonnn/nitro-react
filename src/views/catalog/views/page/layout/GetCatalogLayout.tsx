import { ICatalogPageParser, RoomPreviewer } from '@nitrots/nitro-renderer';
import { CatalogLayoutBadgeDisplayView } from './badge-display/CatalogLayoutBadgeDisplayView';
import { CatalogLayoutDefaultView } from './default/CatalogLayoutDefaultView';
import { CatalogLayoutFrontpage4View } from './frontpage4/CatalogLayoutFrontpage4View';
import { CatalogLayouGuildCustomFurniView } from './guild-custom-furni/CatalogLayoutGuildCustomFurniView';
import { CatalogLayouGuildForumView } from './guild-forum/CatalogLayoutGuildForumView';
import { CatalogLayoutInfoLoyaltyView } from './info-loyalty/CatalogLayoutInfoLoyaltyView';
import { CatalogLayoutPetView } from './pets/CatalogLayoutPetView';
import { CatalogLayoutPets2View } from './pets2/CatalogLayoutPets2View';
import { CatalogLayoutPets3View } from './pets3/CatalogLayoutPets3View';
import { CatalogLayoutSingleBundleView } from './single-bundle/CatalogLayoutSingleBundleView';
import { CatalogLayoutSpacesView } from './spaces-new/CatalogLayoutSpacesView';
import { CatalogLayoutTrophiesView } from './trophies/CatalogLayoutTrophiesView';
import { CatalogLayoutVipBuyView } from './vip-buy/CatalogLayoutVipBuyView';

export const GetCatalogLayout = (pageParser: ICatalogPageParser, roomPreviewer: RoomPreviewer) =>
{
    switch(pageParser.layoutCode)
    {
        case 'frontpage_featured':
            return null
        case 'frontpage4':
            return <CatalogLayoutFrontpage4View roomPreviewer={ roomPreviewer } pageParser={ pageParser } />;
        case 'pets':
            return <CatalogLayoutPetView roomPreviewer={ roomPreviewer } pageParser={ pageParser } />;
        case 'pets2':
            return <CatalogLayoutPets2View roomPreviewer={ roomPreviewer } pageParser={ pageParser } />;
        case 'pets3':
            return <CatalogLayoutPets3View roomPreviewer={ roomPreviewer } pageParser={ pageParser } />;
        case 'vip_buy':
            return <CatalogLayoutVipBuyView roomPreviewer={ roomPreviewer } pageParser={ pageParser } />;
        case 'guild_frontpage':
            return null;
        case 'guild_forum':
            return <CatalogLayouGuildForumView roomPreviewer={ roomPreviewer } pageParser={ pageParser } />;
        case 'guild_custom_furni':
            return <CatalogLayouGuildCustomFurniView roomPreviewer={ roomPreviewer } pageParser={ pageParser } />;
        case 'search_results':
            return null;
        case 'club_gifts':
            return null;
        case 'marketplace_own_items':
            return null;
        case 'marketplace':
            return null;
        case 'single_bundle':
            return <CatalogLayoutSingleBundleView roomPreviewer={ roomPreviewer } pageParser={ pageParser } />;
        case 'spaces_new':
            return <CatalogLayoutSpacesView roomPreviewer={ roomPreviewer } pageParser={ pageParser } />;
        case 'trophies':
            return <CatalogLayoutTrophiesView roomPreviewer={roomPreviewer} pageParser={ pageParser } />;
        case 'info_loyalty':
            return <CatalogLayoutInfoLoyaltyView roomPreviewer={ roomPreviewer } pageParser={ pageParser } />;
        case 'badge_display':
            return <CatalogLayoutBadgeDisplayView roomPreviewer={roomPreviewer} pageParser={ pageParser } />;
        case 'bots':
        case 'default_3x3':
        default:
            return <CatalogLayoutDefaultView roomPreviewer={ roomPreviewer } pageParser={ pageParser } />;
    }
}
