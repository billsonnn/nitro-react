import { FC } from 'react';
import { Column } from '../../../../../../common/Column';
import { Grid } from '../../../../../../common/Grid';
import { CatalogAddOnBadgeWidgetView } from '../../widgets/CatalogAddOnBadgeWidgetView';
import { CatalogBundleGridWidgetView } from '../../widgets/CatalogBundleGridWidgetView';
import { CatalogPurchaseWidgetView } from '../../widgets/CatalogPurchaseWidgetView';
import { CatalogSimplePriceWidgetView } from '../../widgets/CatalogSimplePriceWidgetView';
import { CatalogLayoutProps } from '../CatalogLayout.types';

export const CatalogLayoutSingleBundleView: FC<CatalogLayoutProps> = props =>
{
    const { page = null, roomPreviewer = null } = props;

    return (
        <Grid>
            <Column size={ 6 } overflow="hidden">
                <CatalogAddOnBadgeWidgetView />
                <CatalogSimplePriceWidgetView />
                <CatalogPurchaseWidgetView />
            </Column>
            <Column size={ 6 } overflow="hidden">
                <CatalogBundleGridWidgetView />
            </Column>
        </Grid>
    );
}
