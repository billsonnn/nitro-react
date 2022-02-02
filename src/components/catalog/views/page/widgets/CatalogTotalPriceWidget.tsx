import { FC } from 'react';
import { Column, ColumnProps } from '../../../../../common/Column';
import { useCatalogContext } from '../../../CatalogContext';
import { CatalogPriceDisplayWidgetView } from './CatalogPriceDisplayWidgetView';

interface CatalogSimplePriceWidgetViewProps extends ColumnProps
{

}
export const CatalogTotalPriceWidget: FC<CatalogSimplePriceWidgetViewProps> = props =>
{
    const { gap = 1, ...rest } = props;
    const { currentOffer = null } = useCatalogContext();

    return (
        <Column gap={ gap } { ...rest }>
            <CatalogPriceDisplayWidgetView offer={ currentOffer } />
        </Column>
    );
}
