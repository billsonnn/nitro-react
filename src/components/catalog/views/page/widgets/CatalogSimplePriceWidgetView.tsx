import { FC } from 'react';
import { useCatalog } from '../../../../../hooks';
import { CatalogPriceDisplayWidgetView } from './CatalogPriceDisplayWidgetView';

export const CatalogSimplePriceWidgetView: FC<{}> = props =>
{
    const { currentOffer = null } = useCatalog();

    return (
        <div className="flex items-center bg-muted p-1 rounded gap-1">
            <CatalogPriceDisplayWidgetView offer={ currentOffer } separator={ true } />
        </div>
    );
};
