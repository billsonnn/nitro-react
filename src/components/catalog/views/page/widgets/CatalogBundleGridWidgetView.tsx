import { FC, useEffect, useRef } from 'react';
import { AutoGrid, AutoGridProps, LayoutGridItem } from '../../../../../common';
import { useCatalog } from '../../../../../hooks';

interface CatalogBundleGridWidgetViewProps extends AutoGridProps
{

}

export const CatalogBundleGridWidgetView: FC<CatalogBundleGridWidgetViewProps> = props =>
{
    const { columnCount = 5, children = null, ...rest } = props;
    const { currentOffer = null } = useCatalog();
    const elementRef = useRef<HTMLDivElement>();

    useEffect(() =>
    {
        if(elementRef && elementRef.current) elementRef.current.scrollTop = 0;
    }, [ currentOffer ]);

    if(!currentOffer) return null;

    return (
        <AutoGrid columnCount={ 5 } innerRef={ elementRef } { ...rest }>
            { currentOffer.products && (currentOffer.products.length > 0) && currentOffer.products.map((product, index) => <LayoutGridItem key={ index } itemCount={ product.productCount } itemImage={ product.getIconUrl() } />) }
            { children }
        </AutoGrid>
    );
};
