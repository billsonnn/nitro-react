import { FC, useCallback } from 'react';
import { CatalogPageReadyEvent, CatalogSelectProductEvent } from '../../../../../events';
import { dispatchUiEvent, useUiEvent } from '../../../../../hooks';
import { useCatalogContext } from '../../../context/CatalogContext';

export const CatalogFirstProductSelectorWidgetView: FC<{}> = props =>
{
    const { currentPage = null } = useCatalogContext();

    const onCatalogPageReadyEvent = useCallback((event: CatalogPageReadyEvent) =>
    {
        if(!currentPage || !currentPage.offers.length) return;

        dispatchUiEvent(new CatalogSelectProductEvent(currentPage.offers[0]));
    }, [ currentPage ]);

    useUiEvent(CatalogPageReadyEvent.PAGE_READY, onCatalogPageReadyEvent);

    return null;
}
