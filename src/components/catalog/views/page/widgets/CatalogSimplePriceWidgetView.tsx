import { FC } from 'react';
import { Flex, FlexProps } from '../../../../../common/Flex';
import { useCatalogContext } from '../../../CatalogContext';
import { CatalogPriceDisplayWidgetView } from './CatalogPriceDisplayWidgetView';

interface CatalogSimplePriceWidgetViewProps extends FlexProps
{

}

export const CatalogSimplePriceWidgetView: FC<CatalogSimplePriceWidgetViewProps> = props =>
{
    const { gap = 1, ...rest } = props;
    const { currentOffer = null } = useCatalogContext();

    return (
        <Flex gap={ gap } alignItems="center" classNames={ [ 'bg-muted', 'p-1', 'rounded' ] } { ...rest }>
            <CatalogPriceDisplayWidgetView separator={ true } offer={ currentOffer } />
        </Flex>
    );
}
