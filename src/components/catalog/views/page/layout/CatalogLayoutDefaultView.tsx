import { FC } from 'react';
import { GetConfigurationValue, ProductTypeEnum } from '../../../../../api';
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
                <Column overflow="hidden" size={ 7 }>
                    { GetConfigurationValue('catalog.headers') &&
                        <CatalogHeaderView imageUrl={ currentPage.localization.getImage(0) } /> }
                    <CatalogItemGridWidgetView />
                </Column>
                <Column center={ !currentOffer } overflow="hidden" size={ 5 }>
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
                                <CatalogLimitedItemWidgetView />
                                <Text grow truncate>{ currentOffer.localizationName }</Text>
                                <div className="flex justify-between">
                                    <div className="flex flex-col gap-1">
                                        <CatalogSpinnerWidgetView />
                                    </div>
                                    <CatalogTotalPriceWidget alignItems="end" justifyContent="end" />
                                </div>
                                <CatalogPurchaseWidgetView />
                            </Column>
                        </> }
                </Column>
            </Grid>
        </>
    );
};
