import { FC } from 'react';
import { Column } from '../../../../../common/Column';
import { Grid } from '../../../../../common/Grid';
import { Text } from '../../../../../common/Text';
import { CatalogAddOnBadgeWidgetView } from '../widgets/CatalogAddOnBadgeWidgetView';
import { CatalogBundleGridWidgetView } from '../widgets/CatalogBundleGridWidgetView';
import { CatalogPurchaseWidgetView } from '../widgets/CatalogPurchaseWidgetView';
import { CatalogSimplePriceWidgetView } from '../widgets/CatalogSimplePriceWidgetView';
import { CatalogLayoutProps } from './CatalogLayout.types';

export const CatalogLayoutSingleBundleView: FC<CatalogLayoutProps> = props =>
{
    const { page = null, roomPreviewer = null } = props;

    const imageUrl = page.localization.getImage(1);

    return (
        <>
            <Grid>
                <Column justifyContent="center" size={ 7 } overflow="hidden">
                    <Text dangerouslySetInnerHTML={ { __html: page.localization.getText(2) } } />
                    <CatalogBundleGridWidgetView />
                </Column>
                <Column size={ 5 } overflow="hidden">
                    <Column fullHeight center position="relative">
                        <CatalogAddOnBadgeWidgetView />
                        <CatalogSimplePriceWidgetView />
                        { imageUrl && <img className="" alt="" src={ imageUrl } /> }
                    </Column>
                    <CatalogPurchaseWidgetView />
                </Column>
            </Grid>
        </>
    );
}
