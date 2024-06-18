import { FC, useEffect } from 'react';
import { Column, Grid, Text } from '../../../../../common';
import { useCatalog } from '../../../../../hooks';
import { CatalogPurchaseWidgetView } from '../widgets/CatalogPurchaseWidgetView';
import { CatalogSpacesWidgetView } from '../widgets/CatalogSpacesWidgetView';
import { CatalogTotalPriceWidget } from '../widgets/CatalogTotalPriceWidget';
import { CatalogViewProductWidgetView } from '../widgets/CatalogViewProductWidgetView';
import { CatalogLayoutProps } from './CatalogLayout.types';

export const CatalogLayoutSpacesView: FC<CatalogLayoutProps> = props =>
{
    const { page = null } = props;
    const { currentOffer = null, roomPreviewer = null } = useCatalog();

    useEffect(() =>
    {
        roomPreviewer.updatePreviewObjectBoundingRectangle();
    }, [ roomPreviewer ]);

    return (
        <Grid>
            <Column overflow="hidden" size={ 7 }>
                <CatalogSpacesWidgetView />
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
                        <Column grow gap={ 1 }>
                            <Text grow truncate>{ currentOffer.localizationName }</Text>
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
