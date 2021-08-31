import { ApproveNameMessageEvent, CatalogPageMessageEvent, CatalogPagesListEvent, CatalogPublishedMessageEvent, GiftWrappingConfigurationEvent, HabboClubOffersMessageEvent, LimitedEditionSoldOutEvent, ProductOfferEvent, PurchaseErrorMessageEvent, PurchaseNotAllowedMessageEvent, PurchaseOKMessageEvent, SellablePetPalettesMessageEvent, UserSubscriptionEvent } from '@nitrots/nitro-renderer';
import { GuildMembershipsMessageEvent } from '@nitrots/nitro-renderer/src/nitro/communication/messages/incoming/user/GuildMembershipsMessageEvent';
import { FC, useCallback } from 'react';
import { CatalogNameResultEvent, CatalogPurchaseFailureEvent } from '../../events';
import { CatalogPurchasedEvent } from '../../events/catalog/CatalogPurchasedEvent';
import { CatalogPurchaseSoldOutEvent } from '../../events/catalog/CatalogPurchaseSoldOutEvent';
import { dispatchUiEvent } from '../../hooks/events/ui/ui-event';
import { CreateMessageHook } from '../../hooks/messages/message-event';
import { CatalogMessageHandlerProps } from './CatalogMessageHandler.types';
import { CatalogPetPalette } from './common/CatalogPetPalette';
import { SubscriptionInfo } from './common/SubscriptionInfo';
import { useCatalogContext } from './context/CatalogContext';
import { CatalogActions } from './reducers/CatalogReducer';

export const CatalogMessageHandler: FC<CatalogMessageHandlerProps> = props =>
{
    const { catalogState = null, dispatchCatalogState = null } = useCatalogContext();

    const onCatalogPagesEvent = useCallback((event: CatalogPagesListEvent) =>
    {
        const parser = event.getParser();

        dispatchCatalogState({
            type: CatalogActions.SET_CATALOG_ROOT,
            payload: {
                root: parser.root
            }
        });
    }, [ dispatchCatalogState ]);

    const onCatalogPageEvent = useCallback((event: CatalogPageMessageEvent) =>
    {
        const parser = event.getParser();

        dispatchCatalogState({
            type: CatalogActions.SET_CATALOG_PAGE_PARSER,
            payload: {
                pageParser: parser
            }
        });
    }, [ dispatchCatalogState ]);

    const onCatalogPurchaseEvent = useCallback((event: PurchaseOKMessageEvent) =>
    {
        const parser = event.getParser();

        dispatchUiEvent(new CatalogPurchasedEvent(parser.offer));
    }, []);

    const onCatalogPurchaseFailedEvent = useCallback((event: PurchaseErrorMessageEvent) =>
    {
        const parser = event.getParser();

        console.log(parser);

        dispatchUiEvent(new CatalogPurchaseFailureEvent(parser.code));
    }, []);

    const onCatalogPurchaseUnavailableEvent = useCallback((event: PurchaseNotAllowedMessageEvent) =>
    {
        const parser = event.getParser();

        console.log(parser);
    }, []);

    const onCatalogSoldOutEvent = useCallback((event: LimitedEditionSoldOutEvent) =>
    {
        const parser = event.getParser();

        dispatchUiEvent(new CatalogPurchaseSoldOutEvent());
    }, []);

    const onCatalogSearchEvent = useCallback((event: ProductOfferEvent) =>
    {
        const parser = event.getParser();

        dispatchCatalogState({
            type: CatalogActions.SET_CATALOG_ACTIVE_OFFER,
            payload: {
                activeOffer: parser.offer
            }
        });
    }, [ dispatchCatalogState ]);

    const onSellablePetPalettesEvent = useCallback((event: SellablePetPalettesMessageEvent) =>
    {
        const parser = event.getParser();
        const petPalette = new CatalogPetPalette(parser.productCode, parser.palettes.slice());

        dispatchCatalogState({
            type: CatalogActions.SET_PET_PALETTE,
            payload: { petPalette }
        });
    }, [ dispatchCatalogState ]);

    const onCatalogApproveNameResultEvent = useCallback((event: ApproveNameMessageEvent) =>
    {
        const parser = event.getParser();

        dispatchUiEvent(new CatalogNameResultEvent(parser.result, parser.validationInfo));
    }, []);

    const onCatalogClubEvent = useCallback((event: HabboClubOffersMessageEvent) =>
    {
        const parser = event.getParser();

        dispatchCatalogState({
            type: CatalogActions.SET_CLUB_OFFERS,
            payload: {
                clubOffers: parser.offers
            }
        });
    }, [ dispatchCatalogState ]);

    const onCatalogGroupsEvent = useCallback((event: GuildMembershipsMessageEvent) =>
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

    const onCatalogUpdatedEvent = useCallback((event: CatalogPublishedMessageEvent) =>
    {
        dispatchCatalogState({
            type: CatalogActions.RESET_STATE,
            payload: {}
        });
    }, [ dispatchCatalogState ]);

    const onCatalogGiftConfigurationEvent = useCallback((event: GiftWrappingConfigurationEvent) =>
    {
        const parser = event.getParser();

        dispatchCatalogState({
            type: CatalogActions.SET_GIFT_CONFIGURATION,
            payload: {
                giftConfiguration: parser
            }
        });
    }, [ dispatchCatalogState ]);

    CreateMessageHook(CatalogPagesListEvent, onCatalogPagesEvent);
    CreateMessageHook(CatalogPageMessageEvent, onCatalogPageEvent);
    CreateMessageHook(PurchaseOKMessageEvent, onCatalogPurchaseEvent);
    CreateMessageHook(PurchaseErrorMessageEvent, onCatalogPurchaseFailedEvent);
    CreateMessageHook(PurchaseNotAllowedMessageEvent, onCatalogPurchaseUnavailableEvent);
    CreateMessageHook(LimitedEditionSoldOutEvent, onCatalogSoldOutEvent);
    CreateMessageHook(ProductOfferEvent, onCatalogSearchEvent);
    CreateMessageHook(GuildMembershipsMessageEvent, onCatalogGroupsEvent);
    CreateMessageHook(SellablePetPalettesMessageEvent, onSellablePetPalettesEvent);
    CreateMessageHook(ApproveNameMessageEvent, onCatalogApproveNameResultEvent);
    CreateMessageHook(HabboClubOffersMessageEvent, onCatalogClubEvent);
    CreateMessageHook(UserSubscriptionEvent, onUserSubscriptionEvent);
    CreateMessageHook(CatalogPublishedMessageEvent, onCatalogUpdatedEvent);
    CreateMessageHook(GiftWrappingConfigurationEvent, onCatalogGiftConfigurationEvent);

    return null;
}
