import { FC } from 'react';
import { Column } from '../../../../../../common/Column';
import { Grid } from '../../../../../../common/Grid';
import { useCatalogContext } from '../../../../context/CatalogContext';
import { CatalogPageDetailsView } from '../../../page-details/CatalogPageDetailsView';
import { CatalogProductView } from '../../product/CatalogProductView';
import { CatalogPurchaseView } from '../../purchase/CatalogPurchaseView';
import { CatalogLayoutProps } from '../CatalogLayout.types';

export const CatalogLayoutSingleBundleView: FC<CatalogLayoutProps> = props =>
{
    const { roomPreviewer = null, pageParser = null } = props;
    const { catalogState = null, dispatchCatalogState = null } = useCatalogContext();
    const { activeOffer = null } = catalogState;

    return (
        <Grid>
            <Column size={ 7 } overflow="hidden">
                <Grid grow overflow="auto">
                    { activeOffer && activeOffer.products && (activeOffer.products.length > 0) && activeOffer.products.map((product, index) => <CatalogProductView key={ index } itemActive={ false } product={ product } />)}
                </Grid>
            </Column>
            <Column size={ 5 } overflow="hidden">
                <CatalogPageDetailsView pageParser={ pageParser } />
                { activeOffer && <CatalogPurchaseView offer={ activeOffer } pageId={ pageParser.pageId } /> }
            </Column>
        </Grid>
    );
}
