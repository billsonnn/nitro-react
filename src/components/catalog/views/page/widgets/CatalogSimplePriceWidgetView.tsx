import { FC, useCallback, useState } from 'react';
import { BaseProps } from '../../../../../common/Base';
import { CatalogSelectProductEvent } from '../../../../../events';
import { CatalogWidgetEvent } from '../../../../../events/catalog/CatalogWidgetEvent';
import { useUiEvent } from '../../../../../hooks';
import { IPurchasableOffer } from '../../../common/IPurchasableOffer';
import { CatalogPriceDisplayWidgetView } from './CatalogPriceDisplayWidgetView';

interface CatalogSimplePriceWidgetViewProps extends BaseProps<HTMLDivElement>
{

}

export const CatalogSimplePriceWidgetView: FC<CatalogSimplePriceWidgetViewProps> = props =>
{
    const { ...rest } = props;
    const [ offer, setOffer ] = useState<IPurchasableOffer>(null);

    const onCatalogSelectProductEvent = useCallback((event: CatalogSelectProductEvent) =>
    {
        setOffer(event.offer);
    }, []);

    useUiEvent(CatalogWidgetEvent.SELECT_PRODUCT, onCatalogSelectProductEvent);

    return <CatalogPriceDisplayWidgetView offer={ offer } { ...rest } />;
}
