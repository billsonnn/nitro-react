import { FC } from 'react';
import { Column, ColumnProps } from '../../../../../common';
import { useCatalog } from '../../../../../hooks';
import { CatalogPriceDisplayWidgetView } from './CatalogPriceDisplayWidgetView';

interface CatalogSimplePriceWidgetViewProps extends ColumnProps
{

}
export const CatalogTotalPriceWidget: FC<CatalogSimplePriceWidgetViewProps> = props =>
{
    const { gap = 1, ...rest } = props;
    const { currentOffer = null } = useCatalog();

    return (
        <Column gap={ gap } { ...rest }>
            <CatalogPriceDisplayWidgetView offer={ currentOffer } />
        </Column>
    );
};
