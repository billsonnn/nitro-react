import { ClubGiftInfoParser, ClubOfferData, HabboGroupEntryData, MarketplaceConfigurationMessageParser } from '@nitrots/nitro-renderer';
import { CatalogPetPalette } from './CatalogPetPalette';
import { GiftWrappingConfiguration } from './GiftWrappingConfiguration';
import { SubscriptionInfo } from './SubscriptionInfo';

export interface ICatalogOptions
{
    groups?: HabboGroupEntryData[];
    petPalettes?: CatalogPetPalette[];
    clubOffers?: ClubOfferData[];
    clubGifts?: ClubGiftInfoParser;
    subscriptionInfo?: SubscriptionInfo;
    giftConfiguration?: GiftWrappingConfiguration;
    marketplaceConfiguration?: MarketplaceConfigurationMessageParser;
}
