import { FC } from 'react';
import { Column, Grid, Text } from '../../../../../common';
import { CatalogAddOnBadgeWidgetView } from '../widgets/CatalogAddOnBadgeWidgetView';
import { CatalogBundleGridWidgetView } from '../widgets/CatalogBundleGridWidgetView';
import { CatalogFirstProductSelectorWidgetView } from '../widgets/CatalogFirstProductSelectorWidgetView';
import { CatalogPurchaseWidgetView } from '../widgets/CatalogPurchaseWidgetView';
import { CatalogSimplePriceWidgetView } from '../widgets/CatalogSimplePriceWidgetView';
import { CatalogLayoutProps } from './CatalogLayout.types';

export const CatalogLayoutRoomBundleView: FC<CatalogLayoutProps> = props =>
{
    const { page = null } = props;

    return (
        <>
            <CatalogFirstProductSelectorWidgetView />
            <Grid>
                <Column overflow="hidden" size={ 7 }>
                    { !!page.localization.getText(2) &&
                        <Text dangerouslySetInnerHTML={ { __html: page.localization.getText(2) } } /> }
                    <Column grow className="bg-muted p-2 rounded" overflow="hidden">
                        <CatalogBundleGridWidgetView fullWidth className="nitro-catalog-layout-bundle-grid" />
                    </Column>
                </Column>
                <Column gap={ 1 } overflow="hidden" size={ 5 }>
                    { !!page.localization.getText(1) &&
                        <Text center small overflow="auto">{ page.localization.getText(1) }</Text> }
                    <Column grow gap={ 0 } overflow="hidden" position="relative">
                        { !!page.localization.getImage(1) &&
                            <img alt="" className="!flex-grow" src={ page.localization.getImage(1) } /> }
                        <CatalogAddOnBadgeWidgetView className="bg-muted rounded bottom-0 start-0" position="absolute" />
                        <CatalogSimplePriceWidgetView />
                    </Column>
                    <div className="flex flex-col gap-1">
                        <CatalogPurchaseWidgetView />
                    </div>
                </Column>
            </Grid>
        </>
    );
};
