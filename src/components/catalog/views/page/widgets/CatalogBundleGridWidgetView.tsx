import { FC } from 'react';
import { AutoGrid, AutoGridProps } from '../../../../../common/AutoGrid';
import { LayoutGridItem } from '../../../../../common/layout/LayoutGridItem';
import { useCatalogContext } from '../../../CatalogContext';

interface CatalogBundleGridWidgetViewProps extends AutoGridProps
{

}

export const CatalogBundleGridWidgetView: FC<CatalogBundleGridWidgetViewProps> = props =>
{
    const { columnCount = 5, children = null, ...rest } = props;
    const { currentOffer = null } = useCatalogContext();

    if(!currentOffer) return null;

    return (
        <AutoGrid columnCount={ 5 } { ...rest }>
            { currentOffer.products && (currentOffer.products.length > 0) && currentOffer.products.map((product, index) => <LayoutGridItem key={ index } itemImage={ product.getIconUrl() } itemCount={ product.productCount } />) }
            { children }
        </AutoGrid>
    );
}
