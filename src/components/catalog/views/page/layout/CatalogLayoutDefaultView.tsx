import { FC } from 'react';
import { Base } from '../../../../../common/Base';
import { Column } from '../../../../../common/Column';
import { Flex } from '../../../../../common/Flex';
import { Grid } from '../../../../../common/Grid';
import { Text } from '../../../../../common/Text';
import { useCatalogContext } from '../../../CatalogContext';
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
    const { currentOffer = null } = useCatalogContext();

    return (
        <Grid>
            <Column size={ 7 } overflow="hidden">
                <CatalogItemGridWidgetView />
            </Column>
            <Column center={ !currentOffer } size={ 5 } overflow="hidden">
                { !currentOffer &&
                    <>
                        { !!page.localization.getImage(1) && <img alt="" src={ page.localization.getImage(1) } /> }
                        <Text center dangerouslySetInnerHTML={ { __html: page.localization.getText(0) } } />
                    </> }
                { currentOffer &&
                    <>
                        <Base position="relative" overflow="hidden">
                            <CatalogViewProductWidgetView />
                            <CatalogLimitedItemWidgetView fullWidth position="absolute" className="top-1" />
                            <CatalogAddOnBadgeWidgetView position="absolute" className="bg-muted rounded bottom-1 end-1" />
                        </Base>
                        <Column grow gap={ 1 }>
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
    );
}
