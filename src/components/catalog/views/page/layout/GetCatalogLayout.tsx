import { RoomPreviewer } from '@nitrots/nitro-renderer';
import { ICatalogPage } from '../../../common/ICatalogPage';
import { CatalogLayoutBadgeDisplayView } from './badge-display/CatalogLayoutBadgeDisplayView';
import { CatalogLayoutProps } from './CatalogLayout.types';
import { CatalogLayoutDefaultView } from './default/CatalogLayoutDefaultView';
import { CatalogLayoutFrontpage4View } from './frontpage4/CatalogLayoutFrontpage4View';
import { CatalogLayouGuildCustomFurniView } from './guild-custom-furni/CatalogLayoutGuildCustomFurniView';
import { CatalogLayouGuildForumView } from './guild-forum/CatalogLayoutGuildForumView';
import { CatalogLayouGuildFrontpageView } from './guild-frontpage/CatalogLayoutGuildFrontpageView';
import { CatalogLayoutInfoLoyaltyView } from './info-loyalty/CatalogLayoutInfoLoyaltyView';
import { CatalogLayoutMarketplaceOwnItemsView } from './marketplace/CatalogLayoutMarketplaceOwnItemsView';
import { CatalogLayoutMarketplacePublicItemsView } from './marketplace/CatalogLayoutMarketplacePublicItemsView';
import { CatalogLayoutPetView } from './pets/CatalogLayoutPetView';
import { CatalogLayoutPets2View } from './pets2/CatalogLayoutPets2View';
import { CatalogLayoutPets3View } from './pets3/CatalogLayoutPets3View';
import { CatalogLayoutRoomBundleView } from './room-bundle/CatalogLayoutRoomBundleView';
import { CatalogLayoutSingleBundleView } from './single-bundle/CatalogLayoutSingleBundleView';
import { CatalogLayoutSpacesView } from './spaces-new/CatalogLayoutSpacesView';
import { CatalogLayoutTrophiesView } from './trophies/CatalogLayoutTrophiesView';
import { CatalogLayoutVipBuyView } from './vip-buy/CatalogLayoutVipBuyView';
import { CatalogLayoutVipGiftsView } from './vip-gifts/CatalogLayoutVipGiftsView';

export const GetCatalogLayout = (page: ICatalogPage, roomPreviewer: RoomPreviewer) =>
{
    const layoutProps: CatalogLayoutProps = { page, roomPreviewer };

    switch(page.layoutCode)
    {
        case 'frontpage_featured':
            return null
        case 'frontpage4':
            return <CatalogLayoutFrontpage4View { ...layoutProps } />;
        case 'pets':
            return <CatalogLayoutPetView { ...layoutProps } />;
        case 'pets2':
            return <CatalogLayoutPets2View { ...layoutProps } />;
        case 'pets3':
            return <CatalogLayoutPets3View { ...layoutProps } />;
        case 'vip_buy':
            return <CatalogLayoutVipBuyView { ...layoutProps } />;
        case 'guild_frontpage':
            return <CatalogLayouGuildFrontpageView { ...layoutProps } />;
        case 'guild_forum':
            return <CatalogLayouGuildForumView { ...layoutProps } />;
        case 'guild_custom_furni':
            return <CatalogLayouGuildCustomFurniView { ...layoutProps } />;
        case 'search_results':
            return null;
        case 'club_gifts':
            return <CatalogLayoutVipGiftsView { ...layoutProps } />;
        case 'marketplace_own_items':
            return <CatalogLayoutMarketplaceOwnItemsView { ...layoutProps } />;
        case 'marketplace':
            return <CatalogLayoutMarketplacePublicItemsView { ...layoutProps } />;
        case 'single_bundle':
            return <CatalogLayoutSingleBundleView { ...layoutProps } />;
        case 'room_bundle':
            return <CatalogLayoutRoomBundleView { ...layoutProps } />;
        case 'spaces_new':
            return <CatalogLayoutSpacesView { ...layoutProps } />;
        case 'trophies':
            return <CatalogLayoutTrophiesView roomPreviewer={roomPreviewer} page={ page } />;
        case 'info_loyalty':
            return <CatalogLayoutInfoLoyaltyView { ...layoutProps } />;
        case 'badge_display':
            return <CatalogLayoutBadgeDisplayView roomPreviewer={roomPreviewer} page={ page } />;
        //case 'default_3x3_color_grouping':
            //return <CatalogLayoutColorGroupingView { ...layoutProps } />;
        case 'bots':
        case 'default_3x3':
        default:
            return <CatalogLayoutDefaultView { ...layoutProps } />;
    }
}
