import { FC } from 'react';
import { LocalizeText } from '../../../../../api';
import { Column, Grid, Text } from '../../../../../common';
import { useCatalog } from '../../../../../hooks';
import { CatalogBadgeSelectorWidgetView } from '../widgets/CatalogBadgeSelectorWidgetView';
import { CatalogFirstProductSelectorWidgetView } from '../widgets/CatalogFirstProductSelectorWidgetView';
import { CatalogItemGridWidgetView } from '../widgets/CatalogItemGridWidgetView';
import { CatalogLimitedItemWidgetView } from '../widgets/CatalogLimitedItemWidgetView';
import { CatalogPurchaseWidgetView } from '../widgets/CatalogPurchaseWidgetView';
import { CatalogTotalPriceWidget } from '../widgets/CatalogTotalPriceWidget';
import { CatalogViewProductWidgetView } from '../widgets/CatalogViewProductWidgetView';
import { CatalogLayoutProps } from './CatalogLayout.types';

export const CatalogLayoutBadgeDisplayView: FC<CatalogLayoutProps> = props =>
{
    const { page = null } = props;
    const { currentOffer = null } = useCatalog();

    return (
        <>
            <CatalogFirstProductSelectorWidgetView />
            <Grid>
                <Column overflow="hidden" size={ 7 }>
                    <CatalogItemGridWidgetView shrink />
                    <Column gap={ 1 } overflow="hidden">
                        <Text shrink truncate fontWeight="bold">{ LocalizeText('catalog_selectbadge') }</Text>
                        <CatalogBadgeSelectorWidgetView />
                    </Column>
                </Column>
                <Column center={ !currentOffer } overflow="hidden" size={ 5 }>
                    { !currentOffer &&
                        <>
                            { !!page.localization.getImage(1) && <img alt="" src={ page.localization.getImage(1) } /> }
                            <Text center dangerouslySetInnerHTML={ { __html: page.localization.getText(0) } } />
                        </> }
                    { currentOffer &&
                        <>
                            <div className="relative overflow-hidden">
                                <CatalogViewProductWidgetView />
                            </div>
                            <Column className="!flex-grow" gap={ 1 }>
                                <CatalogLimitedItemWidgetView />
                                <Text truncate className="!flex-grow">{ currentOffer.localizationName }</Text>
                                <div className="flex justify-end">
                                    <CatalogTotalPriceWidget alignItems="end" />
                                </div>
                                <CatalogPurchaseWidgetView />
                            </Column>
                        </> }
                </Column>
            </Grid>
        </>
    );
};
