import { FC } from 'react';
import { AutoGrid, AutoGridProps, LayoutGridItem } from '../../../../../common';
import { useCatalog } from '../../../../../hooks';

interface CatalogBundleGridWidgetViewProps extends AutoGridProps
{

}

export const CatalogBundleGridWidgetView: FC<CatalogBundleGridWidgetViewProps> = props =>
{
    const { columnCount = 5, children = null, ...rest } = props;
    const { currentOffer = null } = useCatalog();

    if(!currentOffer) return null;

    return (
        <AutoGrid columnCount={ 5 } { ...rest }>
            { currentOffer.products && (currentOffer.products.length > 0) && currentOffer.products.map((product, index) => <LayoutGridItem key={ index } itemImage={ product.getIconUrl() } itemCount={ product.productCount } />) }
            { children }
        </AutoGrid>
    );
}
