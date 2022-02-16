import { NitroPoint } from '@nitrots/nitro-renderer';
import { FC, useEffect } from 'react';
import { Base } from '../../../../../common/Base';
import { Column } from '../../../../../common/Column';
import { Flex } from '../../../../../common/Flex';
import { Grid } from '../../../../../common/Grid';
import { Text } from '../../../../../common/Text';
import { useCatalogContext } from '../../../CatalogContext';
import { CatalogPurchaseWidgetView } from '../widgets/CatalogPurchaseWidgetView';
import { CatalogSpacesWidgetView } from '../widgets/CatalogSpacesWidgetView';
import { CatalogTotalPriceWidget } from '../widgets/CatalogTotalPriceWidget';
import { CatalogViewProductWidgetView } from '../widgets/CatalogViewProductWidgetView';
import { CatalogLayoutProps } from './CatalogLayout.types';

export const CatalogLayoutSpacesView: FC<CatalogLayoutProps> = props =>
{
    const { page = null } = props;
    const { currentOffer = null, roomPreviewer = null } = useCatalogContext();

    useEffect(() =>
    {
        roomPreviewer.updatePreviewObjectBoundingRectangle(new NitroPoint());
    }, [ roomPreviewer ]);

    return (
        <Grid>
            <Column size={ 7 } overflow="hidden">
                <CatalogSpacesWidgetView />
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
                        </Base>
                        <Column grow gap={ 1 }>
                            <Text grow truncate>{ currentOffer.localizationName }</Text>
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
