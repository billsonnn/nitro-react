import { FC } from 'react';
import { Column } from '../../../../../common/Column';
import { Flex } from '../../../../../common/Flex';
import { Grid } from '../../../../../common/Grid';
import { Text } from '../../../../../common/Text';
import { CatalogAddOnBadgeWidgetView } from '../widgets/CatalogAddOnBadgeWidgetView';
import { CatalogBundleGridWidgetView } from '../widgets/CatalogBundleGridWidgetView';
import { CatalogPurchaseWidgetView } from '../widgets/CatalogPurchaseWidgetView';
import { CatalogSimplePriceWidgetView } from '../widgets/CatalogSimplePriceWidgetView';
import { CatalogLayoutProps } from './CatalogLayout.types';

export const CatalogLayoutSingleBundleView: FC<CatalogLayoutProps> = props =>
{
    const { page = null } = props;

    const imageUrl = page.localization.getImage(1);

    return (
        <>
            <Grid>
                <Column justifyContent="between" size={ 7 } overflow="hidden">
                    <Text dangerouslySetInnerHTML={ { __html: page.localization.getText(2) } } />
                    <Column fit overflow="hidden" className="bg-muted p-2 rounded">
                        <CatalogBundleGridWidgetView className="nitro-catalog-layout-bundle-grid" fullWidth />
                    </Column>
                </Column>
                <Column size={ 5 } overflow="hidden" gap={ 1 }>
                    <Text center overflow="auto">{ page.localization.getText(1) }</Text>
                    <Flex fullHeight center position="relative" overflow="hidden">
                        { imageUrl && <img className="" alt="" src={ imageUrl } /> }
                        <CatalogAddOnBadgeWidgetView position="absolute" className="bottom-0 start-0" />
                    </Flex>
                    <Column gap={ 1 } position="relative">
                        <Flex center>
                            <CatalogSimplePriceWidgetView />
                        </Flex>
                        <CatalogPurchaseWidgetView />
                    </Column>
                </Column>
            </Grid>
        </>
    );
}
