import { CatalogPageEvent, CatalogPagesEvent, CatalogPurchaseEvent, CatalogPurchaseFailedEvent, CatalogPurchaseUnavailableEvent, CatalogSearchEvent, CatalogSoldOutEvent } from 'nitro-renderer';
import { FC, useCallback } from 'react';
import { CatalogPurchaseFailureEvent } from '../../events';
import { CatalogPurchasedEvent } from '../../events/catalog/CatalogPurchasedEvent';
import { CatalogPurchaseSoldOutEvent } from '../../events/catalog/CatalogPurchaseSoldOutEvent';
import { dispatchUiEvent } from '../../hooks/events/ui/ui-event';
import { CreateMessageHook } from '../../hooks/messages/message-event';
import { CatalogMessageHandlerProps } from './CatalogMessageHandler.types';
import { useCatalogContext } from './context/CatalogContext';
import { CatalogActions } from './reducers/CatalogReducer';

export const CatalogMessageHandler: FC<CatalogMessageHandlerProps> = props =>
{
    const { dispatchCatalogState = null } = useCatalogContext();

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

    CreateMessageHook(CatalogPagesEvent, onCatalogPagesEvent);
    CreateMessageHook(CatalogPageEvent, onCatalogPageEvent);
    CreateMessageHook(CatalogPurchaseEvent, onCatalogPurchaseEvent);
    CreateMessageHook(CatalogPurchaseFailedEvent, onCatalogPurchaseFailedEvent);
    CreateMessageHook(CatalogPurchaseUnavailableEvent, onCatalogPurchaseUnavailableEvent);
    CreateMessageHook(CatalogSoldOutEvent, onCatalogSoldOutEvent);
    CreateMessageHook(CatalogSearchEvent, onCatalogSearchEvent);

    return null;
}
