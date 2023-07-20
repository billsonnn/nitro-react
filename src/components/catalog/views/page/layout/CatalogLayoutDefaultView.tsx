import { FC } from 'react';
import { GetConfiguration, ProductTypeEnum } from '../../../../../api';
import { Column, Flex, Grid, LayoutImage, Text } from '../../../../../common';
import { useCatalog } from '../../../../../hooks';
import { CatalogHeaderView } from '../../catalog-header/CatalogHeaderView';
import { CatalogAddOnBadgeWidgetView } from '../widgets/CatalogAddOnBadgeWidgetView';
import { CatalogItemGridWidgetView } from '../widgets/CatalogItemGridWidgetView';
import { CatalogLimitedItemWidgetView } from '../widgets/CatalogLimitedItemWidgetView';
import { CatalogPurchaseWidgetView } from '../widgets/CatalogPurchaseWidgetView';
import { CatalogSpinnerWidgetView } from '../widgets/CatalogSpinnerWidgetView';
import { CatalogTotalPriceWidget } from '../widgets/CatalogTotalPriceWidget';
import { CatalogViewProductWidgetView } from '../widgets/CatalogViewProductWidgetView';
import { CatalogLayoutProps } from './CatalogLayout.types';

export const CatalogLayoutDefaultView: FC<CatalogLayoutProps> = props =>
{
    const { page = null } = props;
    const { currentOffer = null, currentPage = null } = useCatalog();

    return (
        <>
            <Grid>
                <Column size={ 7 } overflow="hidden">
                    { GetConfiguration('catalog.headers') &&
                        <CatalogHeaderView imageUrl={ currentPage.localization.getImage(0) }/> }
                    <CatalogItemGridWidgetView />
                </Column>
                <Column center={ !currentOffer } size={ 5 } overflow="hidden">
                    { !currentOffer &&
                        <>
                            { !!page.localization.getImage(1) && 
                                <LayoutImage imageUrl={ page.localization.getImage(1) } /> }
                            <Text center dangerouslySetInnerHTML={ { __html: page.localization.getText(0) } } />
                        </> }
                    { currentOffer &&
                        <>
                            <Flex center overflow="hidden" style={ { height: 140 } }>
                                { (currentOffer.product.productType !== ProductTypeEnum.BADGE) &&
                                    <>
                                        <CatalogViewProductWidgetView />
                                        <CatalogAddOnBadgeWidgetView className="bg-muted rounded bottom-1 end-1" />
                                    </> }
                                { (currentOffer.product.productType === ProductTypeEnum.BADGE) && <CatalogAddOnBadgeWidgetView className="scale-2" /> }
                            </Flex>
                            <Column grow gap={ 1 }>
                                <CatalogLimitedItemWidgetView fullWidth />
                                <Text grow truncate>{ currentOffer.localizationName }</Text>
                                <Flex justifyContent="between">
                                    <Column gap={ 1 }>
                                        <CatalogSpinnerWidgetView />
                                    </Column>
                                    <CatalogTotalPriceWidget justifyContent="end" alignItems="end" />
                                </Flex>
                                <CatalogPurchaseWidgetView />
                            </Column>
                        </> }
                </Column>
            </Grid>
        </>
    );
}
