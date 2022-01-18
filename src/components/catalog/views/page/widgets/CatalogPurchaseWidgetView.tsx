import { FC, useCallback } from 'react';
import { CatalogSelectProductEvent } from '../../../../../events';
import { useUiEvent } from '../../../../../hooks';

interface CatalogPurchaseWidgetViewProps
{

}

export const CatalogPurchaseWidgetView: FC<CatalogPurchaseWidgetViewProps> = props =>
{
    const {} = props;

    const onCatalogSelectProductEvent = useCallback((event: CatalogSelectProductEvent) =>
    {

    }, []);

    useUiEvent(CatalogSelectProductEvent.SELECT_PRODUCT, onCatalogSelectProductEvent);

    return null;
}
