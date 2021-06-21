import { CatalogApproveNameResultEvent, CatalogClubEvent, CatalogGroupsEvent, CatalogPageEvent, CatalogPagesEvent, CatalogPurchaseEvent, CatalogPurchaseFailedEvent, CatalogPurchaseUnavailableEvent, CatalogSearchEvent, CatalogSoldOutEvent, CatalogUpdatedEvent, SellablePetPalettesEvent, UserSubscriptionEvent } from 'nitro-renderer';
import { FC, useCallback } from 'react';
import { CatalogNameResultEvent, CatalogPurchaseFailureEvent } from '../../events';
import { CatalogPurchasedEvent } from '../../events/catalog/CatalogPurchasedEvent';
import { CatalogPurchaseSoldOutEvent } from '../../events/catalog/CatalogPurchaseSoldOutEvent';
import { dispatchUiEvent } from '../../hooks/events/ui/ui-event';
import { CreateMessageHook } from '../../hooks/messages/message-event';
import { CatalogMessageHandlerProps } from './CatalogMessageHandler.types';
import { useCatalogContext } from './context/CatalogContext';
import { CatalogActions } from './reducers/CatalogReducer';
import { CatalogPetPalette } from './utils/CatalogPetPalette';
import { SubscriptionInfo } from './utils/SubscriptionInfo';

export const CatalogMessageHandler: FC<CatalogMessageHandlerProps> = props =>
{
    const { catalogState = null, dispatchCatalogState = null } = useCatalogContext();

    const onCatalogPagesEvent = useCallback((event: CatalogPagesEvent) =>
    {
        const parser = event.getParser();

        dispatchCatalogState({
            type: CatalogActions.SET_CATALOG_ROOT,
            payload: {
                root: parser.root
            }
        });
    }, [ dispatchCatalogState ]);

    const onCatalogPageEvent = useCallback((event: CatalogPageEvent) =>
    {
        const parser = event.getParser();

        dispatchCatalogState({
            type: CatalogActions.SET_CATALOG_PAGE_PARSER,
            payload: {
                pageParser: parser
            }
        });
    }, [ dispatchCatalogState ]);

    const onCatalogPurchaseEvent = useCallback((event: CatalogPurchaseEvent) =>
    {
        const parser = event.getParser();

        dispatchUiEvent(new CatalogPurchasedEvent(parser.offer));
    }, []);

    const onCatalogPurchaseFailedEvent = useCallback((event: CatalogPurchaseFailedEvent) =>
    {
        const parser = event.getParser();

        dispatchUiEvent(new CatalogPurchaseFailureEvent(parser.code));
    }, []);

    const onCatalogPurchaseUnavailableEvent = useCallback((event: CatalogPurchaseUnavailableEvent) =>
    {
        const parser = event.getParser();
    }, []);

    const onCatalogSoldOutEvent = useCallback((event: CatalogSoldOutEvent) =>
    {
        const parser = event.getParser();

        dispatchUiEvent(new CatalogPurchaseSoldOutEvent());
    }, []);

    const onCatalogSearchEvent = useCallback((event: CatalogSearchEvent) =>
    {
        const parser = event.getParser();

        dispatchCatalogState({
            type: CatalogActions.SET_CATALOG_ACTIVE_OFFER,
            payload: {
                activeOffer: parser.offer
            }
        });
    }, [ dispatchCatalogState ]);

    const onSellablePetPalettesEvent = useCallback((event: SellablePetPalettesEvent) =>
    {
        const parser = event.getParser();
        const petPalette = new CatalogPetPalette(parser.productCode, parser.palettes.slice());

        dispatchCatalogState({
            type: CatalogActions.SET_PET_PALETTE,
            payload: { petPalette }
        });
    }, [ dispatchCatalogState ]);

    const onCatalogApproveNameResultEvent = useCallback((event: CatalogApproveNameResultEvent) =>
    {
        const parser = event.getParser();

        dispatchUiEvent(new CatalogNameResultEvent(parser.result, parser.validationInfo));
    }, []);

    const onCatalogClubEvent = useCallback((event: CatalogClubEvent) =>
    {
        const parser = event.getParser();

        dispatchCatalogState({
            type: CatalogActions.SET_CLUB_OFFERS,
            payload: {
                clubOffers: parser.offers
            }
        });
    }, [ dispatchCatalogState ]);

    const onCatalogGroupsEvent = useCallback((event: CatalogGroupsEvent) =>
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
                    Math.max(0, parser.days),
                    Math.max(0, parser.months),
                    parser.isVip,
                    parser.pastClubDays,
                    parser.pastVIPDays
                )
            }
        });
    }, [ dispatchCatalogState ]);

    const onCatalogUpdatedEvent = useCallback((event: CatalogUpdatedEvent) =>
    {
        dispatchCatalogState({
            type: CatalogActions.RESET_STATE,
            payload: {}
        });
    }, [ dispatchCatalogState ]);

    CreateMessageHook(CatalogPagesEvent, onCatalogPagesEvent);
    CreateMessageHook(CatalogPageEvent, onCatalogPageEvent);
    CreateMessageHook(CatalogPurchaseEvent, onCatalogPurchaseEvent);
    CreateMessageHook(CatalogPurchaseFailedEvent, onCatalogPurchaseFailedEvent);
    CreateMessageHook(CatalogPurchaseUnavailableEvent, onCatalogPurchaseUnavailableEvent);
    CreateMessageHook(CatalogSoldOutEvent, onCatalogSoldOutEvent);
    CreateMessageHook(CatalogSearchEvent, onCatalogSearchEvent);
    CreateMessageHook(CatalogGroupsEvent, onCatalogGroupsEvent);
    CreateMessageHook(SellablePetPalettesEvent, onSellablePetPalettesEvent);
    CreateMessageHook(CatalogApproveNameResultEvent, onCatalogApproveNameResultEvent);
    CreateMessageHook(CatalogClubEvent, onCatalogClubEvent);
    CreateMessageHook(UserSubscriptionEvent, onUserSubscriptionEvent);
    CreateMessageHook(CatalogUpdatedEvent, onCatalogUpdatedEvent);

    return null;
}
