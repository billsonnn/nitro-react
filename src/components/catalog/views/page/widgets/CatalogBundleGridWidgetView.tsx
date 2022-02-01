import { FC } from 'react';
import { Grid, GridProps } from '../../../../../common/Grid';
import { LayoutGridItem } from '../../../../../common/layout/LayoutGridItem';
import { useCatalogContext } from '../../../context/CatalogContext';

interface CatalogBundleGridWidgetViewProps extends GridProps
{

}

export const CatalogBundleGridWidgetView: FC<CatalogBundleGridWidgetViewProps> = props =>
{
    const { children = null, ...rest } = props;
    const { currentOffer = null } = useCatalogContext();

    if(!currentOffer) return null;

    return (
        <Grid grow columnCount={ 5 } overflow="auto" { ...rest }>
            { currentOffer.products && (currentOffer.products.length > 0) && currentOffer.products.map((product, index) => <LayoutGridItem key={ index } itemImage={ product.getIconUrl() } itemCount={ product.productCount } />) }
            { children }
        </Grid>
    );
}
