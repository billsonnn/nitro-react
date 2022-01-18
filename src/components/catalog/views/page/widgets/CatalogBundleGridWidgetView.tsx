import { FC, useCallback, useState } from 'react';
import { Grid, GridProps } from '../../../../../common/Grid';
import { LayoutGridItem } from '../../../../../common/layout/LayoutGridItem';
import { CatalogPageReadyEvent, CatalogSelectProductEvent } from '../../../../../events';
import { dispatchUiEvent, useUiEvent } from '../../../../../hooks';
import { IPurchasableOffer } from '../../../common/IPurchasableOffer';
import { useCatalogContext } from '../../../context/CatalogContext';

interface CatalogBundleGridWidgetViewProps extends GridProps
{

}

export const CatalogBundleGridWidgetView: FC<CatalogBundleGridWidgetViewProps> = props =>
{
    const { children = null, ...rest } = props;
    const [ offer, setOffer ] = useState<IPurchasableOffer>(null);
    const { currentPage = null } = useCatalogContext();

    const onCatalogSelectProductEvent = useCallback((event: CatalogSelectProductEvent) =>
    {
        setOffer(event.offer);
    }, []);

    useUiEvent(CatalogSelectProductEvent.SELECT_PRODUCT, onCatalogSelectProductEvent);

    const onCatalogPageReadyEvent = useCallback((event: CatalogPageReadyEvent) =>
    {
        if(!currentPage || (currentPage.offers.length !== 1)) return;

        const offer = currentPage.offers[0];

        dispatchUiEvent(new CatalogSelectProductEvent(offer));
    }, [ currentPage ]);

    useUiEvent(CatalogPageReadyEvent.PAGE_READY, onCatalogPageReadyEvent);

    if(!offer) return null;

    return (
        <Grid grow columnCount={ 5 } overflow="auto" { ...rest }>
            { offer.products && (offer.products.length > 0) && offer.products.map((product, index) => <LayoutGridItem key={ index } itemImage={ product.getIconUrl() } />) }
            { children }
        </Grid>
    );
}
