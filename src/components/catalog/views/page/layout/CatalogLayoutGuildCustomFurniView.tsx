import { FC } from 'react';
import { Column, Grid, Text } from '../../../../../common';
import { useCatalog } from '../../../../../hooks';
import { CatalogGuildBadgeWidgetView } from '../widgets/CatalogGuildBadgeWidgetView';
import { CatalogGuildSelectorWidgetView } from '../widgets/CatalogGuildSelectorWidgetView';
import { CatalogItemGridWidgetView } from '../widgets/CatalogItemGridWidgetView';
import { CatalogPurchaseWidgetView } from '../widgets/CatalogPurchaseWidgetView';
import { CatalogTotalPriceWidget } from '../widgets/CatalogTotalPriceWidget';
import { CatalogViewProductWidgetView } from '../widgets/CatalogViewProductWidgetView';
import { CatalogLayoutProps } from './CatalogLayout.types';

export const CatalogLayouGuildCustomFurniView: FC<CatalogLayoutProps> = props =>
{
    const { page = null } = props;
    const { currentOffer = null } = useCatalog();

    return (
        <Grid>
            <Column overflow="hidden" size={ 7 }>
                <CatalogItemGridWidgetView />
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
                            <CatalogGuildBadgeWidgetView className="bottom-1 end-1" position="absolute" />
                        </div>
                        <Column grow gap={ 1 }>
                            <Text truncate>{ currentOffer.localizationName }</Text>
                            <div className="!flex-grow">
                                <CatalogGuildSelectorWidgetView />
                            </div>
                            <div className="flex justify-end">
                                <CatalogTotalPriceWidget alignItems="end" />
                            </div>
                            <CatalogPurchaseWidgetView />
                        </Column>
                    </> }
            </Column>
        </Grid>
    );
};
