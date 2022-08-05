import { FC } from 'react';
import { Flex, FlexProps } from '../../../../../common';
import { useCatalog } from '../../../../../hooks';
import { CatalogPriceDisplayWidgetView } from './CatalogPriceDisplayWidgetView';

interface CatalogSimplePriceWidgetViewProps extends FlexProps
{

}

export const CatalogSimplePriceWidgetView: FC<CatalogSimplePriceWidgetViewProps> = props =>
{
    const { gap = 1, ...rest } = props;
    const { currentOffer = null } = useCatalog();

    return (
        <Flex gap={ gap } alignItems="center" classNames={ [ 'bg-muted', 'p-1', 'rounded' ] } { ...rest }>
            <CatalogPriceDisplayWidgetView separator={ true } offer={ currentOffer } />
        </Flex>
    );
}
