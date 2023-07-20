import { ICatalogPage } from '../../../../../api';
import { CatalogLayoutProps } from './CatalogLayout.types';
import { CatalogLayoutBadgeDisplayView } from './CatalogLayoutBadgeDisplayView';
import { CatalogLayoutColorGroupingView } from './CatalogLayoutColorGroupingView';
import { CatalogLayoutDefaultView } from './CatalogLayoutDefaultView';
import { CatalogLayouGuildCustomFurniView } from './CatalogLayoutGuildCustomFurniView';
import { CatalogLayouGuildForumView } from './CatalogLayoutGuildForumView';
import { CatalogLayouGuildFrontpageView } from './CatalogLayoutGuildFrontpageView';
import { CatalogLayoutInfoLoyaltyView } from './CatalogLayoutInfoLoyaltyView';
import { CatalogLayoutPets2View } from './CatalogLayoutPets2View';
import { CatalogLayoutPets3View } from './CatalogLayoutPets3View';
import { CatalogLayoutRoomAdsView } from './CatalogLayoutRoomAdsView';
import { CatalogLayoutRoomBundleView } from './CatalogLayoutRoomBundleView';
import { CatalogLayoutSingleBundleView } from './CatalogLayoutSingleBundleView';
import { CatalogLayoutSoundMachineView } from './CatalogLayoutSoundMachineView';
import { CatalogLayoutSpacesView } from './CatalogLayoutSpacesView';
import { CatalogLayoutTrophiesView } from './CatalogLayoutTrophiesView';
import { CatalogLayoutVipBuyView } from './CatalogLayoutVipBuyView';
import { CatalogLayoutFrontpage4View } from './frontpage4/CatalogLayoutFrontpage4View';
import { CatalogLayoutMarketplaceOwnItemsView } from './marketplace/CatalogLayoutMarketplaceOwnItemsView';
import { CatalogLayoutMarketplacePublicItemsView } from './marketplace/CatalogLayoutMarketplacePublicItemsView';
import { CatalogLayoutPetView } from './pets/CatalogLayoutPetView';
import { CatalogLayoutVipGiftsView } from './vip-gifts/CatalogLayoutVipGiftsView';

export const GetCatalogLayout = (page: ICatalogPage, hideNavigation: () => void) =>
{
    if(!page) return null;

    const layoutProps: CatalogLayoutProps = { page, hideNavigation };

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
            return <CatalogLayoutTrophiesView { ...layoutProps } />;
        case 'info_loyalty':
            return <CatalogLayoutInfoLoyaltyView { ...layoutProps } />;
        case 'badge_display':
            return <CatalogLayoutBadgeDisplayView { ...layoutProps } />;
        case 'roomads':
            return <CatalogLayoutRoomAdsView { ...layoutProps } />;
        case 'default_3x3_color_grouping':
            return <CatalogLayoutColorGroupingView { ...layoutProps } />;
        case 'soundmachine':
            return <CatalogLayoutSoundMachineView { ...layoutProps } />;
        case 'bots':
        case 'default_3x3':
        default:
            return <CatalogLayoutDefaultView { ...layoutProps } />;
    }
}
