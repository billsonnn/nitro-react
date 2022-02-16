import { FC } from 'react';
import { Base } from '../../../../../common/Base';
import { Column } from '../../../../../common/Column';
import { Flex } from '../../../../../common/Flex';
import { Grid } from '../../../../../common/Grid';
import { Text } from '../../../../../common/Text';
import { useCatalogContext } from '../../../CatalogContext';
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
                            <CatalogGuildBadgeWidgetView position="absolute" className="bottom-1 end-1" />
                        </Base>
                        <Column grow gap={ 1 }>
                            <Text truncate>{ currentOffer.localizationName }</Text>
                            <Base grow>
                                <CatalogGuildSelectorWidgetView />
                            </Base>
                            <Flex justifyContent="end">
                                <CatalogTotalPriceWidget alignItems="end" />
                            </Flex>
                            <CatalogPurchaseWidgetView />
                        </Column>
                    </> }
            </Column>
        </Grid>
    );
}
