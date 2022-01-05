import { ApproveNameMessageEvent, CatalogPageMessageEvent, CatalogPagesListEvent, CatalogPublishedMessageEvent, ClubGiftInfoEvent, GiftReceiverNotFoundEvent, GiftWrappingConfigurationEvent, HabboClubOffersMessageEvent, LimitedEditionSoldOutEvent, MarketplaceConfigurationEvent, MarketplaceMakeOfferResult, ProductOfferEvent, PurchaseErrorMessageEvent, PurchaseNotAllowedMessageEvent, PurchaseOKMessageEvent, SellablePetPalettesMessageEvent, UserSubscriptionEvent } from '@nitrots/nitro-renderer';
import { GuildMembershipsMessageEvent } from '@nitrots/nitro-renderer/src/nitro/communication/messages/incoming/user/GuildMembershipsMessageEvent';
import { FC, useCallback } from 'react';
import { LocalizeText } from '../../api';
import { CatalogNameResultEvent, CatalogPurchaseFailureEvent } from '../../events';
import { CatalogGiftReceiverNotFoundEvent } from '../../events/catalog/CatalogGiftReceiverNotFoundEvent';
import { CatalogPurchasedEvent } from '../../events/catalog/CatalogPurchasedEvent';
import { CatalogPurchaseSoldOutEvent } from '../../events/catalog/CatalogPurchaseSoldOutEvent';
import { dispatchUiEvent } from '../../hooks/events/ui/ui-event';
import { CreateMessageHook } from '../../hooks/messages/message-event';
import { NotificationAlertType } from '../notification-center/common/NotificationAlertType';
import { NotificationUtilities } from '../notification-center/common/NotificationUtilities';
import { CatalogMessageHandlerProps } from './CatalogMessageHandler.types';
import { CatalogPetPalette } from './common/CatalogPetPalette';
import { SubscriptionInfo } from './common/SubscriptionInfo';
import { useCatalogContext } from './context/CatalogContext';
import { CatalogActions } from './reducers/CatalogReducer';

export const CatalogMessageHandler: FC<CatalogMessageHandlerProps> = props =>
{
    const { catalogState = null, dispatchCatalogState = null } = useCatalogContext();

    const onCatalogPagesListEvent = useCallback((event: CatalogPagesListEvent) =>
    {
        const parser = event.getParser();

        dispatchCatalogState({
            type: CatalogActions.SET_CATALOG_ROOT,
            payload: {
                root: parser.root
            }
        });
    }, [ dispatchCatalogState ]);

    const onCatalogPageMessageEvent = useCallback((event: CatalogPageMessageEvent) =>
    {
        const parser = event.getParser();

        dispatchCatalogState({
            type: CatalogActions.SET_CATALOG_PAGE_PARSER,
            payload: {
                pageParser: parser
            }
        });
    }, [ dispatchCatalogState ]);

    const onPurchaseOKMessageEvent = useCallback((event: PurchaseOKMessageEvent) =>
    {
        const parser = event.getParser();

        dispatchUiEvent(new CatalogPurchasedEvent(parser.offer));
    }, []);

    const onPurchaseErrorMessageEvent = useCallback((event: PurchaseErrorMessageEvent) =>
    {
        const parser = event.getParser();

        dispatchUiEvent(new CatalogPurchaseFailureEvent(parser.code));
    }, []);

    const onPurchaseNotAllowedMessageEvent = useCallback((event: PurchaseNotAllowedMessageEvent) =>
    {
        const parser = event.getParser();
    }, []);

    const onLimitedEditionSoldOutEvent = useCallback((event: LimitedEditionSoldOutEvent) =>
    {
        const parser = event.getParser();

        dispatchUiEvent(new CatalogPurchaseSoldOutEvent());
    }, []);

    const onProductOfferEvent = useCallback((event: ProductOfferEvent) =>
    {
        const parser = event.getParser();

        dispatchCatalogState({
            type: CatalogActions.SET_CATALOG_ACTIVE_OFFER,
            payload: {
                activeOffer: parser.offer
            }
        });
    }, [ dispatchCatalogState ]);

    const onSellablePetPalettesMessageEvent = useCallback((event: SellablePetPalettesMessageEvent) =>
    {
        const parser = event.getParser();
        const petPalette = new CatalogPetPalette(parser.productCode, parser.palettes.slice());

        dispatchCatalogState({
            type: CatalogActions.SET_PET_PALETTE,
            payload: { petPalette }
        });
    }, [ dispatchCatalogState ]);

    const onApproveNameMessageEvent = useCallback((event: ApproveNameMessageEvent) =>
    {
        const parser = event.getParser();

        dispatchUiEvent(new CatalogNameResultEvent(parser.result, parser.validationInfo));
    }, []);

    const onGiftReceiverNotFoundEvent = useCallback(() =>
    {
        dispatchUiEvent(new CatalogGiftReceiverNotFoundEvent());
    }, []);

    const onHabboClubOffersMessageEvent = useCallback((event: HabboClubOffersMessageEvent) =>
    {
        const parser = event.getParser();

        dispatchCatalogState({
            type: CatalogActions.SET_CLUB_OFFERS,
            payload: {
                clubOffers: parser.offers
            }
        });
    }, [ dispatchCatalogState ]);

    const onGuildMembershipsMessageEvent = useCallback((event: GuildMembershipsMessageEvent) =>
    {
        const parser = event.getParser();

        dispatchCatalogState({
            type: CatalogActions.SET_GROUPS,
            payload: {
                groups: parser.groups
            }
        });
    }, [ dispatchCatalogState ]);

    const onUserSubscriptionEvent = useCallback((event: UserSubscriptionEvent) =>
    {
        const parser = event.getParser();

        dispatchCatalogState({
            type: CatalogActions.SET_SUBSCRIPTION_INFO,
            payload: {
                subscriptionInfo: new SubscriptionInfo(
                    Math.max(0, parser.daysToPeriodEnd),
                    Math.max(0, parser.periodsSubscribedAhead),
                    parser.isVip,
                    parser.pastClubDays,
                    parser.pastVipDays
                )
            }
        });
    }, [ dispatchCatalogState ]);

    const onCatalogPublishedMessageEvent = useCallback((event: CatalogPublishedMessageEvent) =>
    {
        dispatchCatalogState({
            type: CatalogActions.RESET_STATE,
            payload: {}
        });
    }, [ dispatchCatalogState ]);

    const onGiftWrappingConfigurationEvent = useCallback((event: GiftWrappingConfigurationEvent) =>
    {
        const parser = event.getParser();

        dispatchCatalogState({
            type: CatalogActions.SET_GIFT_CONFIGURATION,
            payload: {
                giftConfiguration: parser
            }
        });
    }, [ dispatchCatalogState ]);

    const onMarketplaceMakeOfferResult = useCallback((event: MarketplaceMakeOfferResult) =>
    {
        const parser = event.getParser();

        if(!parser) return;

        let title = '';
        if(parser.result === 1)
        {
            title = LocalizeText('inventory.marketplace.result.title.success');
        }
        else
        {
            title = LocalizeText('inventory.marketplace.result.title.failure');
        }

        const message = LocalizeText(`inventory.marketplace.result.${parser.result}`);
        
        NotificationUtilities.simpleAlert(message, NotificationAlertType.DEFAULT, null, null, title);
    }, []);

    const onMarketplaceConfigurationEvent = useCallback((event: MarketplaceConfigurationEvent) =>
    {
        const parser = event.getParser();

        if(!parser) return;

        console.log(parser);
        
        dispatchCatalogState({
            type: CatalogActions.SET_MARKETPLACE_CONFIGURATION,
            payload: {
                marketplaceConfiguration: parser
            }
        });
    }, [dispatchCatalogState]);

    const onClubGiftInfoEvent = useCallback((event: ClubGiftInfoEvent) =>
    {
        const parser = event.getParser();

        if(!parser) return;

        dispatchCatalogState({
            type: CatalogActions.SET_CLUB_GIFTS,
            payload: {
                clubGifts: parser
            }
        });
    }, [dispatchCatalogState]);

    CreateMessageHook(CatalogPagesListEvent, onCatalogPagesListEvent);
    CreateMessageHook(CatalogPageMessageEvent, onCatalogPageMessageEvent);
    CreateMessageHook(PurchaseOKMessageEvent, onPurchaseOKMessageEvent);
    CreateMessageHook(PurchaseErrorMessageEvent, onPurchaseErrorMessageEvent);
    CreateMessageHook(PurchaseNotAllowedMessageEvent, onPurchaseNotAllowedMessageEvent);
    CreateMessageHook(LimitedEditionSoldOutEvent, onLimitedEditionSoldOutEvent);
    CreateMessageHook(ProductOfferEvent, onProductOfferEvent);
    CreateMessageHook(GuildMembershipsMessageEvent, onGuildMembershipsMessageEvent);
    CreateMessageHook(SellablePetPalettesMessageEvent, onSellablePetPalettesMessageEvent);
    CreateMessageHook(ApproveNameMessageEvent, onApproveNameMessageEvent);
    CreateMessageHook(GiftReceiverNotFoundEvent, onGiftReceiverNotFoundEvent);
    CreateMessageHook(HabboClubOffersMessageEvent, onHabboClubOffersMessageEvent);
    CreateMessageHook(UserSubscriptionEvent, onUserSubscriptionEvent);
    CreateMessageHook(CatalogPublishedMessageEvent, onCatalogPublishedMessageEvent);
    CreateMessageHook(GiftWrappingConfigurationEvent, onGiftWrappingConfigurationEvent);
    CreateMessageHook(ClubGiftInfoEvent, onClubGiftInfoEvent);
    CreateMessageHook(MarketplaceMakeOfferResult, onMarketplaceMakeOfferResult);
    CreateMessageHook(MarketplaceConfigurationEvent, onMarketplaceConfigurationEvent);

    return null;
}
