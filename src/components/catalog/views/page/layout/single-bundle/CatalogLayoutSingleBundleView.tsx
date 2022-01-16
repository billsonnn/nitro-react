import { FC } from 'react';
import { Column } from '../../../../../../common/Column';
import { Grid } from '../../../../../../common/Grid';
import { useCatalogContext } from '../../../../context/CatalogContext';
import { CatalogPageDetailsView } from '../../../page-details/CatalogPageDetailsView';
import { CatalogPurchaseView } from '../../purchase/CatalogPurchaseView';
import { CatalogLayoutProps } from '../CatalogLayout.types';

export const CatalogLayoutSingleBundleView: FC<CatalogLayoutProps> = props =>
{
    const { page = null, roomPreviewer = null } = props;
    const { currentOffer = null } = useCatalogContext();

    return (
        <Grid>
            <Column size={ 7 } overflow="hidden">
                <Grid grow overflow="auto">
                    {/* { currentOffer && currentOffer.products && (activeOffer.products.length > 0) && activeOffer.products.map((product, index) => <CatalogProductView key={ index } itemActive={ false } product={ product } />)} */}
                </Grid>
            </Column>
            <Column size={ 5 } overflow="hidden">
                <CatalogPageDetailsView page={ page } />
                { currentOffer && <CatalogPurchaseView offer={ currentOffer } pageId={ page.pageId } /> }
            </Column>
        </Grid>
    );
}
